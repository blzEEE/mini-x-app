import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
    @IsString({message: "Логин должен быть строкой"})
    @IsNotEmpty({message: "Логин не должен быть пустым"})
    login: string;

    @IsString({message: "Логин должен быть строкой"})
    @IsNotEmpty({message: "Логин не должен быть пустым"})
    password: string;
}