import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './interfaces/jwt.interface';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
    private COOKIE_DOMAIN;
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService
    ) {
        this.COOKIE_DOMAIN = this.configService.getOrThrow('COOKIE_DOMAIN');
    }

    async login(response: Response, LoginDto: LoginDto){
        const user = await this.prismaService.user.findUnique({
            where: {
                login: LoginDto.login
            }
        })

        if(!user){
            throw new NotFoundException("Пользователь не найден");
        }
        if(await verify(user.password, LoginDto.password)){
            throw new NotFoundException("Пользователь не найден")
        }

        const payload: JwtPayload = {id: user.id}

        return this.auth(response, payload, user.id);
    }

    async register(response: Response, RegisterDto: RegisterDto){
        const user = await this.userService.create(RegisterDto)
        const payload: JwtPayload = {
            id: user.id
        } 
        return this.auth(response, payload, user.id);
    }

    private auth(response: Response, payload: JwtPayload, id: string){
        const {accessToken, refreshToken} = this.generateJwt(payload)

        this.setCookie(response, refreshToken, id, new Date(Date.now() + 1000 * 60 * 60 * 24 * 7))

        return accessToken
    }

    private generateJwt(payload: JwtPayload){
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m'
        })

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d'
        })

        return {
            accessToken,
            refreshToken
        }
    }

    private setCookie(response: Response, refreshToken: string, id: string, expires: Date){
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            domain: this.COOKIE_DOMAIN,
            expires,
        })

        response.cookie('user', id, {
            httpOnly: true,
            domain: this.COOKIE_DOMAIN,
            expires,
        })
    }
}
