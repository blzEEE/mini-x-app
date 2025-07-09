import { BadRequestException, Injectable, NotFoundException, UsePipes } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService
  ){}

  async create(createUserDto: CreateUserDto) {
    const {username, login, password} = createUserDto

    let isExist = await this.prismaService.user.findUnique({
      where: {
        login
      }
    });
    console.log(username)
    if(isExist){
      throw new BadRequestException({message: "Пользователь с таким логином уже существует"});
    }

    const hashPassword = await hash(password)
    const user = await this.prismaService.user.create({
      data: {
        username,
        login,
        password: hashPassword
      }
    })
    return user;
  }

  async findAll() {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        login: true
      },
      orderBy: {
        username: 'asc'
      }
    })
    return users;
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id
      },
      include: {
        followedBy: true,
        following: true,
        _count: {
          select: {
            followedBy: true,
            following: true
          }
        }
      }
    })

    if(!user){
      throw new NotFoundException({message: "Пользователь не найден service"})
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const isExist = await this.prismaService.user.findUnique({
      where: {
        id
      }
    })

    if(!isExist){
      throw new NotFoundException({message: "Пользователь не найден"})
    }

    if(updateUserDto.password){
      updateUserDto.password = await hash(updateUserDto.password)
    }

    const user = await this.prismaService.user.update({
      where: {
        id
      },
      data: {...updateUserDto}
    })

    return user;
  }

  async remove(id: string) {
    const isExist = await this.prismaService.user.findUnique({
      where: {
        id
      }
    })

    if(!isExist){
      throw new NotFoundException({message: "Пользователь не найден"})
    }

    const user = await this.prismaService.user.delete({
      where: {
        id
      }
    })
    return true;
  }

  async follow(request: Request, id: string){
    const followedById = request.cookies.user

    const result = await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: {
          id
        }, 
        data:{
          following: {
            connect: {
              id: followedById
            }
          }
        }
      }),
      this.prismaService.user.update({
        where: {
          id: followedById
        },
        data: {
          followedBy: {
            connect: {
              id
            }
          }
         }
      })
    ])
    return result
  }

  async unfollow(request: Request, id: string){
    const followedById = request.cookies.user

    const result = await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: {
          id
        },
        data: {
          following: {
            disconnect: {
              id: followedById
            }
          }
        }
      }),
      this.prismaService.user.update({
        where: {
          id: followedById
        },
        data: {
          followedBy: {
            disconnect: {
              id
            }
          }
        }
      })
    ])
    return result
  }
}
