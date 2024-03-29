import {UserRegisterDto} from "./dto/user-register.dto";
import {User} from "./user.entity";
import {UserLoginDto} from "./dto/user-login.dto";
import {IUserService} from "./users.service.interface";
import {inject, injectable} from "inversify";
import 'reflect-metadata';
import {IConfigService} from "../config/config.service.interface";
import {TYPES} from "../types";
import {IUsersRepository} from "./users.repository.interface";
import {UserModel} from "@prisma/client";

@injectable()
export class UserService implements IUserService {
    constructor(@inject(TYPES.ConfigService) private configService: IConfigService,
                @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository
    ) {}

    async createUser ({email, name, password}: UserRegisterDto): Promise<UserModel | null> {
        const newUser = new User(email, name);
        const salt = this.configService.get('SALT');
        await newUser.setPassword(password, Number(salt));
        const existedUser = await this.usersRepository.find(email);
        if (existedUser) {
            return null;
        }

        return this.usersRepository.create(newUser);
    }

    async validateUser ({email, password}: UserLoginDto): Promise<boolean> {
        const salt = this.configService.get('SALT');
        const existedUser = await this.usersRepository.find(email);
        if (existedUser) {
            const newUser = new User(existedUser?.email, existedUser?.name, existedUser?.password);
            return newUser.comparePassword(password);
        } else {
            return false;
        }
    }
}