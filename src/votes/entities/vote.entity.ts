import { User } from './../../users/entities/user.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/entities/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity('votes')
@ObjectType()
export class Vote extends BaseModel {
  @Column()
  @Field(() => Int)
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  @Field(() => User)
  user: User;

  @Column()
  @Field(() => String)
  username: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @Field(() => Post)
  post: Post;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
  @Field(() => Comment)
  comment: Comment;
}
