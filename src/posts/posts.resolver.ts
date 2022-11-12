import { User } from 'src/users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @Context('req') req,
  ) {
    const user = await this.usersService.findOne(req.user.username);

    return this.postsService.create(createPostInput, user);
  }

  @Query(() => [Post], { name: 'posts' })
  findAll() {
    return this.postsService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postsService.findOne(id);
  }

  @Mutation(() => Post)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postsService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  async removePost(
    @Args('id', { type: () => Int }) id: number,
    @Context('req') req,
  ) {
    const user = await this.usersService.findOne(req.user.username);
    return this.postsService.remove(id, user);
  }
}
