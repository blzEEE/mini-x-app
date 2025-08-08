import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Res({passthrough: true}) response, @Body() LoginDto: LoginDto){
    return this.authService.login(response, LoginDto);
  }

  @Post('register')
  register(@Res({passthrough: true}) response, @Body() RegisterDto: RegisterDto){
    return this.authService.register(response, RegisterDto)
  }

  @Get('logout')
  logout(@Res({passthrough: true}) response: Response){
    return this.authService.logout(response);
  }
}
