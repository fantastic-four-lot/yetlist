import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { ObjectId } from "mongodb";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const matched = await bcrypt.compare(pass, user.password); // note: user.password
    if (!matched) return null;
    return { id: user._id.toHexString(), email: user.email , name: user.name };
  }

  async getUserbyEmail(email: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) return null;
      return { id: user._id.toHexString(), email: user.email , name: user.name };
    } catch (err) {
      return null;
    }
    
  }

  

  async login(user: any) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    const hash = await bcrypt.hash(refreshToken, 10);

    await this.refreshTokenService.create(
      user.id,   
      hash,
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }


  async checkRefreshToken(incomingToken: string) {
    const payload = this.jwtService.verify(incomingToken, {secret: process.env.JWT_REFRESH_SECRET,});
    // console.log('Payload from refresh token:', payload);

    const tokenDoc = await this.refreshTokenService.findActive(payload.id);
    if (!tokenDoc) throw new UnauthorizedException();
    // console.log('Stored token document:', tokenDoc);

    const valid = await bcrypt.compare(incomingToken, tokenDoc.tokenHash);
    if (!valid) throw new UnauthorizedException();
    // console.log('Refresh token is valid');

    // revoke old token
    await this.refreshTokenService.revoke(tokenDoc._id);

    // generate new refresh token
    // const newRefresh = this.jwtService.sign(
    //   { id: payload.id },
    //   { expiresIn: "7d" }
    // );
    const newRefresh = await this.generateRefreshToken({ id: payload.id});
    // console.log('Generated new refresh token');

    const newHash = await bcrypt.hash(newRefresh, 10);
    await this.refreshTokenService.create(payload.id, newHash);

    // const accessToken = this.jwtService.sign({
    //   id: payload.id,
    //   email: payload.email,
    // });
    const accessToken = await this.generateAccessToken({ id: payload.id, email: payload.email,name : payload.name });
    const user = await this.usersService.findById(payload.id);
    // console.log('Fetched user for access token:', user);

    return {
      accessToken,
      newRefreshToken: newRefresh,
      user: { _id: user._id, email: user.email, name: user.name },
    };
  }

  async logout(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);
    await this.refreshTokenService.revokeAll(payload.id);
  }



  async generateAccessToken(user: any) {
      return this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        }
      );
  }


  async generateRefreshToken(user: any) {
        return this.jwtService.sign(
        {
          id: user.id,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        }
      );
  }

  async signup(createUserDto: any) {
    const user = await this.usersService.create(createUserDto);
    if(!user) {
      throw new Error('User creation failed');
    }
    return true;
  }
}
