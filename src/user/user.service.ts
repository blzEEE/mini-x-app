import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
      }
    })

    if(!user){
      throw new NotFoundException({message: "Пользователь не найден"})
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
}
