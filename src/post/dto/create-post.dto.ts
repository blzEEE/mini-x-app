import { IsString } from "class-validator";
import { CreateTagDto } from "src/tag/dto/create-tag.dto";

export class CreatePostDto {
    @IsString({message: "Заголовок должен быть строкой"})
    title: string;
    text: string;
    tags: string[];
    
}