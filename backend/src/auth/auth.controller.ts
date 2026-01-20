// ---------------------------
// FILE: src/auth/auth.controller.ts
// ---------------------------
import { Body, Controller, Post, UsePipes, ValidationPipe, HttpCode, HttpStatus, Req, Get, UseGuards, Res, UnauthorizedException } from '@nestjs/common';
import { Response,Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private refreshTokenService: RefreshTokenService) {}



    @Post('signup')
    @UsePipes(new ValidationPipe({ whitelist: true }))
        async signup(@Body() dto: CreateUserDto) {
            return this.authService.signup(dto);
        }


    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ whitelist: true }))
        async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response
        ) {
        const user = await this.authService.validateUser(dto.email, dto.password);
        console.log('User attempting to log in:', user);

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const { accessToken, refreshToken } = await this.authService.login(user);

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",  
            path: "/auth/refresh",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            accessToken,
            user
        };
        }

    @Post("logout")
        async logout(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies?.refresh_token;

        if (refreshToken) {
            await this.authService.logout(refreshToken);
        }

        res.clearCookie("refresh_token", {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // true in prod
            path: "/",
        });

        return res.json({
            message: "Logged out successfully",
        });
        }




   @Get('me')
   @UseGuards(JwtAuthGuard)
    async tokenValidation(@Req() req: any) {
        const userdetails = await this.authService.getUserbyEmail(req.user.email);
        return userdetails;
    }

    @Post("refresh")
    @HttpCode(200)
    async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
    ) {
    const oldRefreshToken = req.cookies?.refresh_token;
    if (!oldRefreshToken) throw new UnauthorizedException();

    const { accessToken, newRefreshToken, user } =
        await this.authService.checkRefreshToken(oldRefreshToken);

    res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken, user };
    }

   


  @Get('profile')
  @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: any) {
        return { profile: req.user };
    }
}