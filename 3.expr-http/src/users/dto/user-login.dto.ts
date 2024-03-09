import {IsEmail, IsString} from "class-validator";

export class UserLoginDto {
    @IsEmail({}, {message: 'Неверно указан логин'})
    email: string;

    @IsString({message: 'Неверный формат строки пароля'})
    password: string;
}