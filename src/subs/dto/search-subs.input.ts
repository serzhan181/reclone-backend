import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SearchSubsInput {
  @Field(() => String, { nullable: true })
  term?: string;
}
