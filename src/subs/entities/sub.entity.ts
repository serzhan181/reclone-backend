import { Subscription } from './subscription.entity';
import { User } from 'src/users/entities/user.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';
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
import { Expose } from 'class-transformer';

@Entity('subs')
@ObjectType()
export class Sub extends BaseModel {
  @Field(() => String)
  @Index()
  @Column({ unique: true })
  name: string;

  @Column()
  @Field(() => String)
  title: string;

  @Field(() => String)
  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  subImgUrn: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  bannerUrn: string;

  @Column()
  @Field(() => String)
  creator_name: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creator_name', referencedColumnName: 'username' })
  @Field(() => User)
  creator: User;

  @OneToMany(() => Post, (post) => post.sub)
  @Field(() => [Post])
  posts: Post[];

  @Field(() => [Subscription], { nullable: true })
  @OneToMany(() => Subscription, (subscription) => subscription.subscribedTo)
  subscribers: Subscription[];

  @Field(() => String, { nullable: true })
  @Expose()
  get subImgUrl() {
    return this?.subImgUrn
      ? `${process.env.APP_URL}/subs/${this.subImgUrn}`
      : null;
  }

  @Field(() => String, { nullable: true })
  @Expose()
  get bannerImgUrl() {
    return this?.bannerUrn
      ? `${process.env.APP_URL}/subs/${this.bannerUrn}`
      : null;
  }

  @Field(() => Int)
  @Expose()
  get subsribersCount() {
    return this.subscribers?.length || 0;
  }

  @Field(() => Boolean, { nullable: true })
  protected isUserSubscribed: boolean;
  setIsUserSubscribed(userId: number) {
    this.isUserSubscribed = this.subscribers.some(
      (s) => s.subscriber?.id === userId,
    );
  }
}
