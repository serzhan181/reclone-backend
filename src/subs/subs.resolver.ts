import { OptionalJwtAuthGuard } from './../auth/guards/optional-jwt-auth.guard';
import { UploadSubImages } from './dto/upload-sub-images';
import { User } from 'src/users/entities/user.entity';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SubsService } from './subs.service';
import { Sub } from './entities/sub.entity';
import { CreateSubInput } from './dto/create-sub.input';
import { UpdateSubInput } from './dto/update-sub.input';
import { UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDecorator } from 'src/decorators/user.decorator';
import { IsSubOwnerGuard } from 'src/subs/guards/is-sub-owner.guard';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionService } from './subscription.service';

@Resolver(() => Sub)
export class SubsResolver {
  constructor(
    private readonly subsService: SubsService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Sub)
  async createSub(
    @Args('createSubInput') createSubInput: CreateSubInput,
    @UserDecorator() creator: User,
  ) {
    return this.subsService.create(createSubInput, creator);
  }

  @Query(() => [Sub], { name: 'subs' })
  findAll() {
    return this.subsService.findAll();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => Sub, { name: 'sub' })
  findOne(
    @Args('name', { type: () => String }) name: string,
    @UserDecorator() user: User,
  ) {
    return this.subsService.findOneByName(name, user.id);
  }

  @UseGuards(JwtAuthGuard, IsSubOwnerGuard('uploadSubImages'))
  @Mutation(() => Sub, { name: 'uploadSubImages' })
  async uploadSubImages(
    @Args('uploadSubImages') uploadSubImages: UploadSubImages,
  ) {
    return this.subsService.uploadSubImages(uploadSubImages);
  }

  @Mutation(() => Sub)
  updateSub(@Args('updateSubInput') updateSubInput: UpdateSubInput) {
    return this.subsService.update(updateSubInput.id, updateSubInput);
  }

  @Mutation(() => Sub)
  removeSub(@Args('id', { type: () => Int }) id: number) {
    return this.subsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Subscription)
  async subscribe(
    @Args('subName', { type: () => String }) subName: string,
    @UserDecorator() user: User,
  ) {
    const sub = await this.findOne(subName, user);

    if (!sub) {
      throw new HttpException('This sub does not exist!', HttpStatus.NOT_FOUND);
    }

    return this.subscriptionService.subscribe(sub, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Subscription)
  async unsubscribe(
    @Args('subName', { type: () => String }) subName: string,
    @UserDecorator() user: User,
  ) {
    const sub = await this.findOne(subName, user);

    return this.subscriptionService.unsubscribe(sub, user);
  }
}
