import { Post } from './../../posts/entities/post.entity';
import { User } from './../../users/entities/user.entity';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseModel } from 'src/entities/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;
}
