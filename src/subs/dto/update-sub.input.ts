import { UploadSubImages } from './upload-sub-images';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateSubInput extends UploadSubImages {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
