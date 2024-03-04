#!/usr/bin/env node
import {getArgs} from './helpers/args.js'
import {printError, printHelp, printSuccess, printWeather} from "./services/log.service.js";
import {getKeyValue, saveKeyValue, TOKEN_DICTIONARY} from "./services/storage.service.js";
import {getIcon, getWeather} from "./services/api.service.js";

const saveToken = async (token) => {
    if (!token.length) {
        printError("Не передан токен");
        return;
    }
    try {
        saveKeyValue(TOKEN_DICTIONARY.token, token);
        printSuccess('Токен сохранен');
    } catch (err) {
        printError(err.message);
    }
}

const saveCity = async (city) => {
    if (!city.length) {
        printError("Не передан город");
        return;
    }
    try {
        saveKeyValue(TOKEN_DICTIONARY.city, city);
        printSuccess('Город сохранен');
    } catch (err) {
        printError(err.message);
    }
}

const getForcast = async () => {
    try {
        const city = process.env.CITY ?? await getKeyValue('city');

        const weather =  await getWeather(city);
        printWeather(weather, getIcon('weath'));
    } catch (err) {
        if (err?.response?.status === 404) {
            printError('Неверно указан город');
        } else if (err?.response?.status === 401) {
            printError('Неверно указан токен');
        } else {
            printError(`Ошибка: ${err.message}`);
        }
    }
}

const initCLI = async () => {
    const args = getArgs();

    if (args.h) {
        printHelp();
    }
    if (args.s) {
        // сохранить город
        saveCity(args.s);
    }
    if (args.t) {
        // сохранить токен для АПИ
        saveToken(args.t);
    }
    // а потом просто вывести город
    const city = process.env.CITY ?? await getKeyValue('city');
    if (args.s || city) {
        getForcast();
    }
}

initCLI();