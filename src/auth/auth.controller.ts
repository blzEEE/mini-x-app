import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Res() response, @Body() LoginDto: LoginDto){
    return this.authService.login(response, LoginDto);
  }

  @Post()
  register(@Res() response, @Body() RegisterDto: RegisterDto){
    return this.authService.register(response, RegisterDto)
  }
}
