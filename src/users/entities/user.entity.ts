import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/entities/post.entity';

@Entity('users')
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ unique: true })
  @Field()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  @Field(() => [Post])
  posts: Post[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  profile_picture_urn: string;

  @BeforeInsert()
  @Exclude()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, +process.env.SALT_COUNT);
  }
}
