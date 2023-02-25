import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class VoteInput {
  @Field(() => String, { nullable: true })
  commentId?: string;

  @Field(() => String, { nullable: true })
  postId?: string;

  @Field(() => Int)
  value: -1 | 0 | 1;
}
