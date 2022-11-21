import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';

@InputType()
export class CreateSubInput {
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String)
  title: string;

  @Field(() => GraphQLUpload, { nullable: true })
  subImg?: Promise<FileUpload>;

  @Field(() => GraphQLUpload, { nullable: true })
  bannerImg?: Promise<FileUpload>;
}
