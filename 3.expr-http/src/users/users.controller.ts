import {BaseController} from "../common/base.controller";
import {NextFunction, Response, Request} from "express";
import {HTTPError} from "../errors/http-error.class";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ILogger} from "../logger/logger.interface";
import {IUsersController} from "./users.controllers.interface";
import 'reflect-metadata';

@injectable()
export class UsersController extends BaseController implements IUsersController{
    constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
        super(loggerService);

        this.bindRoutes([
            {path: '/login', method: 'post', func: this.login},
            {path: '/register', method: 'post', func: this.register}
        ])
    }

    register(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'register')
    }

    login(req: Request, res: Response, next: NextFunction) {
        next(new HTTPError(401, 'ошибка авторизации', 'login '));
    }
}