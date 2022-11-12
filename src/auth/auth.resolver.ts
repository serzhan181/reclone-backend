import { CreateUserInput } from './../users/dto/create-user.input';
import { SignUpResponse } from './dto/signup-response';
import { UsersService } from './../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MeResponse } from './dto/me-response';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { LoginResponse } from './dto/login-response';
import { AuthService } from './auth.service';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginUserInput } from './dto/login-user.inputs';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  async login(
    @Args('loginUserInput') _loginUserInput: LoginUserInput,
    @Context('user') ctx_user: User,
  ) {
    const { token, user } = await this.authService.login(ctx_user);

    return { user, access_token: token };
  }

  @Query(() => MeResponse, { nullable: true, name: 'me' })
  @UseGuards(JwtAuthGuard)
  me(@Context('req') req) {
    const user = this.usersService.findOne(req.user.username);

    return {
      authenticated: true,
      user,
    };
  }

  @Mutation(() => SignUpResponse)
  async signUp(@Args('signUpInput') signUpInput: CreateUserInput) {
    return this.authService.signUp(signUpInput);
  }
}
