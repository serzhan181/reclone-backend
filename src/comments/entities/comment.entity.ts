import { Vote } from './../../votes/entities/vote.entity';
import { Post } from './../../posts/entities/post.entity';
import { User } from './../../users/entities/user.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseModel } from 'src/entities/base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('comments')
@ObjectType()
export class Comment extends BaseModel {
  @Column()
  @Field(() => String)
  body: string;

  @Column()
  @Field(() => String)
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;

  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  // Check if current user vote value
  @Field(() => Int)
  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);

    this.userVote = index > -1 ? this.votes[index].value : 0;
  }
}
