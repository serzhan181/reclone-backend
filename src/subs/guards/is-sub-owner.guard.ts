import { User } from 'src/users/entities/user.entity';
import { SubsService } from '../subs.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  mixin,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export const IsSubOwnerGuard = (argId: string) => {
  @Injectable()
  class _IsOwnerGuard implements CanActivate {
    subsService: SubsService;
    constructor(subsService: SubsService) {
      this.subsService = subsService;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = GqlExecutionContext.create(context).getContext().req;
      const args = GqlExecutionContext.create(context).getArgs();

      const user: User = req.user;
      const subName = args[argId].name;
      if (!user || !subName) return false;

      const sub = await this.subsService.findOneByName(subName);

      const canAccess = sub.creator_name === user.username;

      if (!canAccess)
        throw new HttpException(
          'You are not the owner of this sub',
          HttpStatus.FORBIDDEN,
        );

      return true;
    }
  }

  return mixin(_IsOwnerGuard);
};
