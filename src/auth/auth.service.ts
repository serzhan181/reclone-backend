import { IPayload } from './dto/jwt-payload';
import { User } from './../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
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
    if (!passwordMatches || !user) return null;

    const { password: _, ...result } = user;

    return result;
  }

  async login(user: User) {
    const payload: IPayload = { username: user.username, sub: user.id };

    return { token: this.jwtService.sign(payload), user };
  }
}
