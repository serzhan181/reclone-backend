import { Subscription } from './../../subs/entities/subscription.entity';
import { ObjectType, Field } from '@nestjs/graphql';
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
import { Vote } from 'src/votes/entities/vote.entity';

@Entity('users')
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  id: string;

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

  @OneToMany(() => Vote, (vote) => vote.user)
  @Field(() => [Vote])
  votes: Vote[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  profile_picture_urn: string;

  @OneToMany(() => Subscription, (subscription) => subscription.subscriber)
  @Field(() => [Subscription], { nullable: true })
  subscriptions: Subscription[];

  @BeforeInsert()
  @Exclude()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, +process.env.SALT_COUNT);
  }
}
