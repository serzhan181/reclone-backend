import { CreateUserInput } from './../users/dto/create-user.input';
import { User } from './../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOne(username);

    const passwordMatches = await bcrypt.compare(pass, user?.password);

    if (!passwordMatches || !user) {
      throw new HttpException(
        'Wrong username or password',
        HttpStatus.NOT_FOUND,
      );
    }

    const { password: _, ...result } = user;

    return result;
  }

  async signUp(signUpInput: CreateUserInput) {
    const user = await this.usersService.create(signUpInput);

    const access_token = this.createToken(user);

    return { access_token, user };
  }

  async login(user: User) {
    return { token: this.createToken(user), user };
  }

  createToken(user: User) {
    return this.jwtService.sign({ ...user });
  }
}
