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
import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Field, ObjectType, Int } from '@nestjs/graphql';
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
  @OneToMany(() => Comment, (comment) => comment.post, { onDelete: 'CASCADE' })
  @Field(() => [Comment])
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post, { onDelete: 'CASCADE' })
  @Field(() => [Vote])
  votes: Vote[];

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeid(6);
    this.slug = slugify(this.title);
  }

  @Field(() => Int)
  @Expose()
  get commentCount(): number {
    return this.comments?.length || 0;
  }

  @Field(() => Int)
  @Expose()
  get voteScore(): number {
    return this.votes?.reduce((prev, cur) => prev + (cur.value || 0), 0) || 0;
  }

  // Check if current user vote value
  @Field(() => Int, { nullable: true })
  userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }
}
