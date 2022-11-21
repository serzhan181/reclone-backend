import { InputType, Field } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';

@InputType()
export class CreatePostInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  body?: string;

  @Field(() => String)
  subName: string;

  @Field(() => GraphQLUpload, { nullable: true })
  postImg?: Promise<FileUpload>;
}
