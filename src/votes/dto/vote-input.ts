import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VoteInput {
  @Field(() => String, { nullable: true })
  commentId?: string;

  @Field(() => String, { nullable: true })
  postId?: string;
}
