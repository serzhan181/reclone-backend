import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @Length(1, 255)
  username: string;

  @Field()
  @Length(6, 255)
  password: string;

  @Field()
  @IsEmail()
  email: string;
}
