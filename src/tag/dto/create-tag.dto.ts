import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {
    @IsString({message: "Тэг должен быть строкой"})
    @IsNotEmpty({message: "Тэг не должен быть пустой строкой"})
    tag: string;
}