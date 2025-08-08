import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PostService } from './post/post.service';
import { Request } from 'express';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly postService: PostService,
    private readonly userService: UserService
  ){}
  async getHello(request: Request) {
    const user = request.cookies.user
    const followed = await this.userService.getFollowed(user);
    const posts = await this.prismaService.post.findMany({
      where: {
        user: {
          id: {
            in: followed
          }
        }
      },
      select: {
        id: true,
        title: true,
        text: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return posts;
  }
}
