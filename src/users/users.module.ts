import { Post } from 'src/posts/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
