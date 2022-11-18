import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserDecorator = createParamDecorator(
  async (_: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    const req = ctx.req;
    return req?.user;
  },
);
