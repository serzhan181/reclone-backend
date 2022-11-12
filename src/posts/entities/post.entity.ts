import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseModel } from '../../entities/base-entity';
import { makeid } from '../../helpers/makeId';
import { slugify } from '../../helpers/slugify';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

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
  @Field(() => String)
  body: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  @Field(() => User)
  user: User;

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeid(6);
    this.slug = slugify(this.title);
  }
}
