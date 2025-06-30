import { IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
    @IsString({message: "Username must be a string"})
    @IsNotEmpty({message: "Username must not be empty"})
    username: string;

    @IsString({message: "Login must be a string"})
    @IsNotEmpty({message: "Login must not be empty"})
    login: string;

    @IsString({message: "Password must be a string"})
    @IsNotEmpty({message: "Password must not be empty"})
    password: string;
}