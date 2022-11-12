import { InputType, Field } from '@nestjs/graphql';
import { FileUpload } from 'src/types/file.type';
import { GraphQLUpload } from 'graphql-upload-minimal';

@InputType()
export class CreatePostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  body: string;

  @Field(() => GraphQLUpload, { nullable: true })
  postImg?: Promise<FileUpload>;
}
