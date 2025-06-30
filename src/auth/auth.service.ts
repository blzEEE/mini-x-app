import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor() {}

    async login(LoginDto: LoginDto){
        return "login";
    }

    async register(RegisterDto: RegisterDto){
        return "register";
    }
}
