import {BaseController} from "../common/base.controller";
import {NextFunction, Response, Request} from "express";
import {HTTPError} from "../errors/http-error.class";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ILogger} from "../logger/logger.interface";
import {IUsersController} from "./users.controllers.interface";
import {UserLoginDto} from "./dto/user-login.dto";
import {UserRegisterDto} from "./dto/user-register.dto";
import 'reflect-metadata';
import {UserService} from "./users.service";
import {ValidateMiddleware} from "../common/validate.middleware";
import {sign} from "jsonwebtoken";
import {ConfigService} from "../config/config.service";
import {IUserService} from "./users.service.interface";
import {IConfigService} from "../config/config.service.interface";

@injectable()
export class UsersController extends BaseController implements IUsersController{
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.UserService) private userService: IUserService,
        @inject(TYPES.ConfigService) private configService: IConfigService
    ) {
        super(loggerService);

        this.bindRoutes([
            {path: '/login', method: 'post', func: this.login, middlewares: [new ValidateMiddleware(UserLoginDto)]},
            {path: '/register', method: 'post', func: this.register, middlewares: [new ValidateMiddleware(UserRegisterDto)]}
        ])
    }

    async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) {
         const newUser = await this.userService.validateUser(req.body);
         if (!newUser) {
             return next(new HTTPError(401, 'Ошибка авторизации', 'login '));
         }
         const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'))
         this.ok(res, {jwt: jwt});
    }


    async register({body}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction) {
        const newUser = await this.userService.createUser(body);
        if (!newUser) {
            return next(new HTTPError(422, 'Такой пользователь существует'));
        }
        this.ok(res, {email: newUser.email, id: newUser.id});
    }

    private async signJWT(email: string, secret: string) {
        return new Promise<string>((resolve, reject) => {
            sign({
                email,
                iat: Math.floor(Date.now() / 1000)
            }, secret,
                {
                    algorithm: 'HS256'
                },
                (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token as string);
            })
        })
    }
}