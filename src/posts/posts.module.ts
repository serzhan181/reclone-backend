import { Subscription } from './../subs/entities/subscription.entity';
import { Sub } from './../subs/entities/sub.entity';
import { User } from 'src/users/entities/user.entity';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Sub, Subscription]),
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [PostsResolver, PostsService],
})
export class PostsModule {}
