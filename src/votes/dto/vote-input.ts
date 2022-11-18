import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class VoteInput {
  @Field(() => Int, { nullable: true })
  commentId?: number;

  @Field(() => Int, { nullable: true })
  postId?: number;

  @Field(() => Int)
  value: -1 | 0 | 1;
}
