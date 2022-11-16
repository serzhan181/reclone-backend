import { User } from 'src/users/entities/user.entity';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseModel } from 'src/entities/base-entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';

@Entity('subs')
@ObjectType()
export class Sub extends BaseModel {
  @Index()
  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Column()
  @Field(() => String)
  title: string;

  @Field(() => String)
  @Column()
  description: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  postImgUrn: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  bannerUrn: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  @Field(() => User)
  creator: User;

  @OneToMany(() => Post, (post) => post.sub)
  @Field(() => [Post])
  posts: Post[];
}
