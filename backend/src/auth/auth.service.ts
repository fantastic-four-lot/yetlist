import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async login(users: any) {
    const user = { id: users.id, email: users.email, name: users.name };
    return {
      access_token: this.jwtService.sign(user),
      // expires_in: process.env.JWT_EXPIRES_IN || 600,
      user

    };
  }

  async signup(createUserDto: any) {
    const user = await this.usersService.create(createUserDto);
    return this.login(user);
  }
}
