import { Controller, Get, Param, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthorizedGuard } from 'src/guards/authorized.guard';
import { Request, Response } from 'express';
import { CreatePostDto } from './dto/create-post.dto';

@UseGuards(new AuthorizedGuard())
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAll(){
    return this.postService.getAll()
  }

  @Get(':id')
  getById(@Res() response, @Param('id') id: string){
    return this.postService.getById(response, id)
  }

  @Post()
  create(@Req() request: Request, @Body() dto: CreatePostDto){
    console.log(dto)
    return this.postService.create(request, dto);
  }
}
