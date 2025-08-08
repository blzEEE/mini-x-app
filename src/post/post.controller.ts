import { Controller, Get, Param, Post, Body, Req, Res, UseGuards, Query, Put, UsePipes } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthorizedGuard } from 'src/guards/authorized.guard';
import { Request, Response } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { CommentDTO } from './dto/comment-post.dto';
import { SearchByTagPipe } from 'src/pipes/search-by-tag.pipe';

@UseGuards(new AuthorizedGuard())
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAll(){
    return this.postService.getAll();
  }

  @Get('by_id/:id')
  getById(@Param('id') id: string){
    return this.postService.getById(id);
  }

  @Post()
  create(@Req() request: Request, @Body() dto: CreatePostDto){
    return this.postService.create(request, dto);
  }

  @Post('comment/:id')
  commentPost(@Req() request, @Param('id') postId: string, @Body() commentDTO: CommentDTO){
    return this.postService.commentPost(request, postId, commentDTO);
  }

  @Put('like/:id')
  likePost(@Param('id') id: string){
    return this.postService.likePost(id);
  }

  @Put('dislike/:id')
  dislikePost(@Param('id') id: string){
    return this.postService.dislikePost(id);
  }

  @UsePipes(new SearchByTagPipe)
  @Get('byTags')
  searchByTags(@Query('tags') tags: string[]){
    return this.postService.searchByTags(tags)
  }
}
