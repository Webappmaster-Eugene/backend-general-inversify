import {IConfigService} from "./config.service.interface";
import {config, DotenvConfigOutput, DotenvParseOutput} from "dotenv";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ILogger} from "../logger/logger.interface";
import 'reflect-metadata';

@injectable()
export class ConfigService implements IConfigService {
    private config: DotenvParseOutput;
        constructor(@inject(TYPES.ILogger) private logger: ILogger) {

        const result: DotenvConfigOutput = config();
        if (result.error) {
            this.logger.error('Не удалось прочитать переменную')
        }

        this.logger.log('[ConfigService] Конфигурация .env загружена')
        this.config=result.parsed as DotenvParseOutput;
    }

    get<T extends string>(key: string) {
        return this.config[key] as T;
    };
}