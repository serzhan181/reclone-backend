import { CreateUserInput } from './../users/dto/create-user.input';
import { SignUpResponse } from './dto/signup-response';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MeResponse } from './dto/me-response';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { LoginResponse } from './dto/login-response';
import { AuthService } from './auth.service';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginUserInput } from './dto/login-user.inputs';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UserDecorator } from 'src/decorators/user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

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
  me(@UserDecorator() user: User) {
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
