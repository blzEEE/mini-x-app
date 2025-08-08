import { Controller, Get, Param } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  getAll(){
    return this.tagService.getAll();
  }

  @Get(':tag')
  getByTag(@Param('tag') tag: string){
    return this.tagService.getByTag(tag);
  }
}
