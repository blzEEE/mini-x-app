import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from '@prisma/client';

@Injectable()
export class TagService {
    constructor(private readonly prismaService: PrismaService){}

    async getAll(){
        const tags = await this.prismaService.tag.findMany({
            select: {
                id: true,
                tag: true,
                posts: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return tags
    }

    async getByTag(tagName: string){
        const tag = await this.prismaService.tag.findMany({
            where: {
                tag: tagName
            },
            select: {
                id: true,
                tag: true,
                posts: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return tag
    }

    async create(dto: CreateTagDto){
        const tag = await this.prismaService.tag.create({
            data: {...dto}
        })
    }

    async createOrConnect(tags: string[]){
        let addedTags: Tag[];
        tags.forEach(async tag => {
            const newTag = await this.prismaService.tag.upsert({
                data: {tag}
            })
        });
    }
}
