import { CreateSubInput } from './create-sub.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubInput extends PartialType(CreateSubInput) {
  @Field(() => Int)
  id: number;
}
