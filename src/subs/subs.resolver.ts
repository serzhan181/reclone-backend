import { UploadSubImages } from './dto/upload-sub-images';
import { User } from 'src/users/entities/user.entity';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SubsService } from './subs.service';
import { Sub } from './entities/sub.entity';
import { CreateSubInput } from './dto/create-sub.input';
import { UpdateSubInput } from './dto/update-sub.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDecorator } from 'src/decorators/user.decorator';
import { IsSubOwnerGuard } from 'src/subs/guards/is-sub-owner.guard';

@Resolver(() => Sub)
export class SubsResolver {
  constructor(private readonly subsService: SubsService) {}

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

  @Query(() => Sub, { name: 'sub' })
  findOne(@Args('name', { type: () => String }) name: string) {
    return this.subsService.findOneByName(name);
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
}
