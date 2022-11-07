import { IPayload } from './../../dist/auth/dto/jwt-payload.d';
import { LoggedInGuard } from './guards/logged-in.guard';

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
  @UseGuards(LoggedInGuard)
  me(@Context('user') user: IPayload) {
    return {
      authenticated: true,
      user,
    };
  }
}
