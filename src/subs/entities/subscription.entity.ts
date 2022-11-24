import { Sub } from './sub.entity';
import { BaseModel } from 'src/entities/base-entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity('subscription')
@ObjectType()
export class Subscription extends BaseModel {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.subscriptions)
  subscriber: User;

  @Field(() => Sub)
  @ManyToOne(() => Sub, (sub) => sub.subscribers)
  subscribedTo: Sub;
}
