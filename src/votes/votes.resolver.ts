import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { VoteInput } from './dto/vote-input';
import { Vote } from './entities/vote.entity';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { VotesService } from './votes.service';
import { UseGuards } from '@nestjs/common';
import { UserDecorator } from 'src/decorators/user.decorator';
import { Post } from 'src/posts/entities/post.entity';

@Resolver(() => Vote)
export class VotesResolver {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  vote(@Args('voteInput') voteInput: VoteInput, @UserDecorator() user: User) {
    return this.votesService.vote(voteInput, user.username);
  }
}
