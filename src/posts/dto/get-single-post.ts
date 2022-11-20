import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetSinglePost {
  @Field(() => String)
  identifier: string;

  @Field(() => String)
  slug: string;
}
