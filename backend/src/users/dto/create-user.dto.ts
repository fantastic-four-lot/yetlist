import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Unique } from 'typeorm';


export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;
}
