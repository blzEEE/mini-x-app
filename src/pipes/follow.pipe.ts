import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class FollowPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        return value
    }
}