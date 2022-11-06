import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity('users')
@ObjectType()
export class User {
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

  @Column({ nullable: true })
  @Field({ nullable: true })
  profile_picture_urn: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, +process.env.SALT_COUNT);
  }
}
