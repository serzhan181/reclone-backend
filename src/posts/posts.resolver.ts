import { GetSinglePost } from './dto/get-single-post';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { UserDecorator } from 'src/decorators/user.decorator';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';

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
    @UserDecorator() user: User,
  ) {
    console.log('CREATE POST', createPostInput);

    return this.postsService.create(createPostInput, user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => [Post], { name: 'posts' })
  findAll(@UserDecorator() user: User) {
    return this.postsService.findAll(user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => Post, { name: 'post' })
  findOne(
    @Args('getSinglePost') { identifier, slug }: GetSinglePost,
    @UserDecorator() user: User,
  ) {
    return this.postsService.findOne(identifier, slug, user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => [Post], { name: 'postsBySubName' })
  findPostsBySubname(
    @Args('subName', { type: () => String }) subName: string,
    @UserDecorator() user: User,
  ) {
    return this.postsService.findPostsBySubname(subName, user);
  }

  @Mutation(() => Post)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postsService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  async removePost(
    @Args('id', { type: () => Int }) id: number,
    @UserDecorator() user: User,
  ) {
    return this.postsService.remove(id, user);
  }
}
