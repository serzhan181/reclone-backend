import { CreateUserInput } from './../users/dto/create-user.input';
import { IPayload } from './dto/jwt-payload';
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

    console.log('user', user);
    console.log('password', pass);

    const passwordMatches = await bcrypt.compare(pass, user?.password);

    console.log('isValidPassowrd', passwordMatches);
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

    const access_token = this.createToken({
      username: user.username,
      sub: user.id,
    });

    return { access_token, user };
  }

  async login(user: User) {
    const payload: IPayload = { username: user.username, sub: user.id };

    return { token: this.createToken(payload), user };
  }

  createToken(payload: IPayload) {
    return this.jwtService.sign(payload);
  }
}
