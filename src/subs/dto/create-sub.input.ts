import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';

@InputType()
export class CreateSubInput {
  @IsNotEmpty()
  @Field(() => String)
  @MaxLength(15)
  name: string;

  @Field(() => String, { nullable: true })
  @MaxLength(255)
  description: string;

  @Field(() => String)
  @MaxLength(30)
  title: string;

  @Field(() => GraphQLUpload, { nullable: true })
  subImg?: Promise<FileUpload>;

  @Field(() => GraphQLUpload, { nullable: true })
  bannerImg?: Promise<FileUpload>;
}
