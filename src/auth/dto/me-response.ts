import { User } from './../../users/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MeResponse {
  @Field()
  authenticated: boolean;

  @Field()
  user: User;
}
