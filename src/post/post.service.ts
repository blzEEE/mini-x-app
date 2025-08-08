import { Injectable, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { TagService } from 'src/tag/tag.service';
import { RedisService } from 'src/redis/redis.service';
import { CommentDTO } from './dto/comment-post.dto';

@Injectable()
export class PostService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly tagService: TagService,
        private readonly redisService: RedisService
    ) { }

    async getAll() {
        const posts = await this.prismaService.post.findMany({
            include: {
                tags: {
                    select:{
                        tag: true
                    }
                },
                comments: {
                    select: {
                        id: true
                    }
                }
            }
        });
        return posts;
    }
    async getById(id: string){
        const postRedis = await this.redisService.get(id)
        if (postRedis){
            return JSON.parse(postRedis);
        }

        const postDB = await this.prismaService.post.findUnique({
            where: {
                id
            },
            include: {
                tags: true,
                comments: true
            }
        });
        console.log(postDB)

        if (!postDB){
            throw new NotFoundException({message: "Post was not found"})
        }

        await this.redisService.set(id, JSON.stringify(postDB))
        return postDB
    }
    async create(request: Request, dto: CreatePostDto){
        const {title, text, tags} = dto;
        const userId = request.cookies.user
        let post;
        await this.prismaService.$transaction(async tx =>{
            let tagsOnPost = new Array();
            for(const tag of tags){
                const isExist = await tx.tag.findUnique({
                    where: {tag: tag}
                })
                if(isExist){
                    tagsOnPost.push(isExist)
                    continue
                }

                const exist = await tx.tag.create({
                    data: {tag: tag}
                })

                tagsOnPost.push(exist)
            }

            console.log(tagsOnPost)

            post = await tx.post.create({
                data: {
                    title,
                    text,
                    userId,
                    tags: {
                        connect: tagsOnPost
                    }
                }
            })

        }, {
            isolationLevel: 'ReadCommitted'
        }) 
        
        return post;
    }

    async deletePost(id: string){
        const post = await this.prismaService.post.delete({
            where: {
                id
            }
        })

        return 1;
    }

    async commentPost(request: Request, postId: string, commentDTO: CommentDTO){
        const userId = request.cookies.user
        let parentPost;
        const parentPostRedis = await this.redisService.get(postId);

        if(parentPostRedis){
            parentPost = JSON.parse(parentPostRedis);
        }else{
            parentPost = await this.prismaService.post.findUnique({
                where: {
                    id: postId
                },
                select: {
                    id: true,
                    userId: true,
                    tags: {
                        select: {
                            id: true
                        }
                    }
                }
            })
        }

        if(!parentPost){
            throw new NotFoundException({message: "Parent post does not exist"})
        }
        console.log(parentPost)
        const comment = await this.prismaService.post.create({
            data: {
                title: commentDTO.title,
                text: commentDTO.text,
                userId,
                parentId: parentPost.id,
                tags: {
                    connect: parentPost.tags
                }
            }
        })

        return comment;
    }

    async likePost(id: string){
        const post = await this.prismaService.post.update({
            where: {
                id
            },
            data: {
                likes: {
                    increment: 1
                }
            }
        })

        if(!post){
            throw new NotFoundException({message: "Post not found"});
        }

        const postRedis = await this.redisService.get(id);
        if(postRedis){
            await this.redisService.del(id);
            await this.redisService.set(id, JSON.stringify(post));
        }

        return post;
    }

    async dislikePost(id: string){
        const post = await this.prismaService.post.update({
            where: {
                id
            },
            data: {
                likes: {
                    decrement: 1
                }
            }
        })

        if (!post) {
            throw new NotFoundException({ message: "Post not found" });
        }

        const postRedis = await this.redisService.get(id);
        if (postRedis) {
            await this.redisService.del(id);
            await this.redisService.set(id, JSON.stringify(post));
        }

        return post;
    }

    async searchByTags(tags: string[]){
        let posts = await this.prismaService.post.findMany({
            where: {
                tags: {
                    some: {
                        tag: {
                            in: tags
                        }
                    }
                }
            },
            include: {
                tags:{
                    select: {
                        tag: true
                    }
                }
            }
        })
        return posts
    }
}
