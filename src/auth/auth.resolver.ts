import { GqlAuthGuard } from './gql-auth.guard';
import { LoginResponse } from './dto/login-response';
import { AuthService } from './auth.service';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LoginUserInput } from './dto/login-user.inputs';
import { UseGuards } from '@nestjs/common';
import * as cookie from 'cookie';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  async login(
    @Args('loginUserInput') _loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    const { token, user } = await this.authService.login(context.user);

    const res = context.req.res;

    console.log('res', res);

    res?.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.PROJECT_STATE === 'production',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
      }),
    );

    return { user, access_token: token };
  }
}
