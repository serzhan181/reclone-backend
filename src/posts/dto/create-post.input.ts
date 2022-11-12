import { User } from 'src/users/entities/user.entity';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  body: string;
}
