import { Sub } from './../../subs/entities/sub.entity';
import { Comment } from './../../comments/entities/comment.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseModel } from '../../entities/base-entity';
import { makeid } from '../../helpers/makeId';
import { slugify } from '../../helpers/slugify';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Vote } from 'src/votes/entities/vote.entity';

@Entity('posts')
@ObjectType()
export class Post extends BaseModel {
  @Exclude()
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  postImgUrn: string;

  @Index()
  @Column()
  @Field(() => String)
  identifier: string; // 7 character id

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  slug: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  body: string;

  @Column()
  @Field(() => String)
  subName: string;

  @Column()
  @Field(() => String)
  username: string;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  @Field(() => User)
  user: User;

  @Field(() => Sub)
  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: Sub;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  @Field(() => [Comment])
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeid(6);
    this.slug = slugify(this.title);
  }
}
