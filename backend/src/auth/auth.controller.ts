// ---------------------------
// FILE: src/auth/auth.controller.ts
// ---------------------------
import { Body, Controller, Post, UsePipes, ValidationPipe, HttpCode, HttpStatus, Req, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}


    @Post('signup')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async signup(@Body() dto: CreateUserDto) {
        return this.authService.signup(dto);
    }


    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async login(@Body() dto: LoginDto) {
        const user = await this.authService.validateUser(dto.email, dto.password);
        console.log('Authenticated user:', user);
        if (!user) {
        throw new (require('@nestjs/common').UnauthorizedException)('Invalid credentials');
        }
        return this.authService.login(user);
    }


   @Get('me')
    @UseGuards(JwtAuthGuard)
   async tokenValidation(@Req() req: any) {
       const userdetails = await this.authService.getUserbyEmail(req.user.email);
       console.log('Token validation request received',userdetails);


       // Assuming req.user is populated by JwtAuthGuard
       return userdetails;
   }




    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: any) {
        return { profile: req.user };
    }
}