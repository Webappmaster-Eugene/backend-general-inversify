import {App} from "./app";
import {LoggerService} from "./logger/logger.service";
import {UsersController} from "./users/users.controller";
import {ExeptionFilter} from "./errors/exeption.filter";
import {ILogger} from "./logger/logger.interface";
import {Container, ContainerModule, interfaces} from "inversify";
import {TYPES} from "./types";
import {IExeptionFilter} from "./errors/exeption.filter.interface";
import {IUsersController} from "./users/users.controllers.interface";
import 'reflect-metadata';
import {IUserService} from "./users/users.service.interface";
import {UserService} from "./users/users.service";
import {IConfigService} from "./config/config.service.interface";
import {ConfigService} from "./config/config.service";
import {PrismaService} from "./database/prisma.service";
import {IUsersRepository} from "./users/users.repository.interface";
import {UsersRepository} from "./users/users.repository";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
    bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
    bind<IUsersController>(TYPES.UserController).to(UsersController);
    bind<IUserService>(TYPES.UserService).to(UserService);
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
    bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
    bind<App>(TYPES.Application).to(App);
  });

  function bootstrap() {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application)
    app.init();
    return {appContainer, app}
  }

  export const {app, appContainer} = bootstrap()