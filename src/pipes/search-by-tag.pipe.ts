import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class SearchByTagPipe implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        const tags = value.split(',');
        return tags;
    }
}