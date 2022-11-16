import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  body: string;

  @Field(() => String)
  postIdentifier: string;

  @Field(() => String)
  postSlug: string;
}
