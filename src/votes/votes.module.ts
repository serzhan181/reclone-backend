import { UsersModule } from './../users/users.module';
import { Vote } from './entities/vote.entity';
import { User } from './../users/entities/user.entity';
import { Post } from './../posts/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesResolver } from './votes.resolver';
import { Comment } from 'src/comments/entities/comment.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, User, Vote]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UsersModule,
  ],
  providers: [VotesResolver, VotesService],
})
export class VotesModule {}
