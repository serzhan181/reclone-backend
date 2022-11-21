import { InputType, Field } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';

@InputType()
export class UploadSubImages {
  @Field(() => String)
  name: string;

  @Field(() => GraphQLUpload, { nullable: true })
  bannerImg?: Promise<FileUpload>;

  @Field(() => GraphQLUpload, { nullable: true })
  subImg?: Promise<FileUpload>;
}
