import { Controller, Get, Post, Body, Param, Delete, Patch, UseInterceptors, UsePipes, Req, UseGuards, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowInterceptor } from 'src/interceptors/follow.interceptor';
import { FollowPipe } from 'src/pipes/follow.pipe';
import { Request } from 'express';
import { AuthorizedGuard } from 'src/guards/authorized.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @UseGuards(new AuthorizedGuard())
  @Patch('follow/:id')
  follow(@Req() request: Request, @Param('id') id: string){
    console.log(id)
    return this.userService.follow(request, id)
  }

  @UseGuards(new AuthorizedGuard())
  @Patch("unfollow/:id")
  unfollow(@Req() request: Request, @Param('id') id: string){
    return this.userService.unfollow(request, id)
  }
}
