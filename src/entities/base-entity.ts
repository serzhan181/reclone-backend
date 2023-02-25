import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export abstract class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  public id: string;

  @CreateDateColumn()
  @Field(() => Date)
  public createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  public updatedAt: Date;
}
