import {App} from "./app";
import {LoggerService} from "./logger/logger.service";
import {UsersController} from "./users/users.controller";
import {ExeptionFilter} from "./errors/exeption.filter";
import {ILogger} from "./logger/logger.interface";
import {Container, ContainerModule, interfaces} from "inversify";
import {TYPES} from "./types";
import {IExeptionFilter} from "./errors/exeption.filter.interface";
import 'reflect-metadata';
import {IUsersController} from "./users/users.controllers.interface";
  export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService);
    bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
    bind<IUsersController>(TYPES.UserController).to(UsersController);
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