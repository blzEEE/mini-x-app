import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString({message: "Имя должно быть строкой"})
    @IsNotEmpty({message: "Имя не может быть пустым"})
    username: string;

    @IsString({message: "Login должно быть строкой"})
    @IsNotEmpty({message: "Login не может быть пустым"})
    login: string;

    @IsString({message: "Password должно быть строкой"})
    @IsNotEmpty({message: "Password не может быть пустым"})
    password: string;
}
