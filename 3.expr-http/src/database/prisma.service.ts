import {inject, injectable} from "inversify";
import {PrismaClient, UserModel } from "@prisma/client";
import {TYPES} from "../types";
import {ILogger} from "../logger/logger.interface";

@injectable()
export class PrismaService {
    client: PrismaClient;

    constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
        this.client = new PrismaClient();
    }

    async connect() {
        try{
            await this.client.$connect();
            this.loggerService.log('[PrismaService] успешное подключение к БД');
        } catch (err) {
            if (err instanceof Error) {
                this.loggerService.error('произошла ошибка - ' + err);
            }
        }
    }

    async disconnect() {
        try{
            await this.client.$disconnect();
            this.loggerService.log('[PrismaService] успешное отключение БД');
        } catch (err) {
            if (err instanceof Error) {
                this.loggerService.error('произошла ошибка - ' + err);
            }
        }
    }
}