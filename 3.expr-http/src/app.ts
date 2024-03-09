import express, {Express} from "express";
import {Server} from 'http';
import {ILogger} from "./logger/logger.interface";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {json} from "body-parser";
import {IExeptionFilter} from "./errors/exeption.filter.interface";
import 'reflect-metadata';
import {IConfigService} from "./config/config.service.interface";
import {IUsersController} from "./users/users.controllers.interface";
import {UsersController} from "./users/users.controller";
import {PrismaService} from "./database/prisma.service";

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
      @inject(TYPES.ILogger) private logger: ILogger,
      @inject(TYPES.UserController) private userController: UsersController,
      @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
      @inject(TYPES.ConfigService) private configService: IConfigService,
      @inject(TYPES.PrismaService) private prismaService: PrismaService
  ) {
    this.app = express();
    this.port = 3000;
  }

  useMiddleware() {
    this.app.use(json());
  }

  useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  useExeptionFilters() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init() {
    this.useMiddleware();
    this.useRoutes();
    this.useExeptionFilters();
    await this.prismaService.connect();
    this.server = this.app.listen(this.port);
    this.logger.log('Сервер запущен на 3000 порту');
  }
}