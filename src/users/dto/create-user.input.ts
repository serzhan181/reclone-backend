import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  id: number;

  @Field()
  username: string;

  @Field()
  password: string;
}
