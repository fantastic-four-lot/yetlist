import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  // update(userId: string, arg1: { refresh_token: any; }) {
  //   throw new Error('Method not implemented.');
  // }
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const saltRounds = 10;
    const hashed = await bcrypt.hash(dto.password, saltRounds);

    const user = this.usersRepository.create({
      email: dto.email,
      password: hashed, // stored in `password` field
      name: dto.name,
    });

    const saved = await this.usersRepository.save(user as any);
    const { password: _pw, ...rest } = saved as any;
    return { id: saved._id.toHexString(), email: rest.email, name: rest.name };
  }

  async findByEmail(email: string) {
    // return full document (including hashed password) so AuthService can compare
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string) {
    const objId = new ObjectId(id);
    const user = await this.usersRepository.findOne({ where: { _id: objId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

}
