// ---------------------------
// FILE: src/auth/auth.module.ts
// ---------------------------
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';


@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      // signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN },
    }),    // JwtModule.register({}),   
    UsersModule,
    RefreshTokenModule, 
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}