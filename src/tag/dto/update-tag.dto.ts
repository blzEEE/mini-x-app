import { IsString, IsNotEmpty } from "class-validator";

export class UpdateTagDto {
    @IsString({message: "Тэг должен быть строкой"})
    @IsNotEmpty({message: "Тэг не должен быть пустой строкой"})
    tag: string;
}
