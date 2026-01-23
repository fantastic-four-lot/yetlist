// ---------------------------
// FILE: src/auth/jwt.strategy.ts
// ---------------------------
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET', 'CHANGE_THIS_SECRET'),
        });
    }


    async validate(payload: any) {
  // payload ONLY has what you signed
  // in your case: payload.id

  const user = await this.authService.getUserById(payload.id);

  if (!user) {
    throw new UnauthorizedException();
  }

  return user; // 🔥 THIS becomes req.user
}
    
}