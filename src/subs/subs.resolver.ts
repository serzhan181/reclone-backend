import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { SubsService } from './subs.service';
import { Sub } from './entities/sub.entity';
import { CreateSubInput } from './dto/create-sub.input';
import { UpdateSubInput } from './dto/update-sub.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@Resolver(() => Sub)
export class SubsResolver {
  constructor(
    private readonly subsService: SubsService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Sub)
  async createSub(
    @Args('createSubInput') createSubInput: CreateSubInput,
    @Context('req') req,
  ) {
    const creator = await this.usersService.findOne(req.user.username);

    return this.subsService.create(createSubInput, creator);
  }

  @Query(() => [Sub], { name: 'subs' })
  findAll() {
    return this.subsService.findAll();
  }

  @Query(() => Sub, { name: 'sub' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.subsService.findOne(id);
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