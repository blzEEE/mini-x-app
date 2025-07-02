import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService){}

    async getAll(){
        const posts = await this.prismaService.post.findMany();
        return posts;
    }
    // async getAll(){
    //     const following = await this.prismaService.user.findMany({
    //         where: {
    //             following: 
    //         }
    //         select: {
    //             id: true
    //         }
    //     })
    //     const posts = await this.prismaService.post.findMany({
    //         where: {
    //             user: {
    //                 id: {
    //                     in: {following}
    //                 }
    //             }
    //         }
    //         orderBy: {
    //             createdAt: 'desc'
    //         }
    //     });
    //     return 
    // }
}
