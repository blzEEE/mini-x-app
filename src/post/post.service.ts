import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { TagService } from 'src/tag/tag.service';

@Injectable()
export class PostService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly tagService: TagService    
    ) { }

    async getAll() {
        const posts = await this.prismaService.post.findMany({
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                        text: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return posts;
    }
    async getById(response: Response, id: string){
        const post = await this.prismaService.post.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                title: true,
                text: true,
                post: true,
                tags: true
            }
        })

        return post
    }
    async create(request: Request, dto: CreatePostDto){
        const {title, text} = dto;
        const tags = this.tagService.createOrConnect(dto.tags);
        const userId = request.cookies.user
        // const post = await this.prismaService.post.create({
        //     data: {
        //         title,
        //         text,
        //         userId,
        //         tags: {
        //             connect: {
        //                 tag: tags
        //             }
        //         }
        //     }
        // })
        return 1;
    }
}
