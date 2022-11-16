import { VoteInput } from './dto/vote-input';
import { Vote } from './entities/vote.entity';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { VotesService } from './votes.service';

@Resolver(() => Vote)
export class VotesResolver {
  constructor(private readonly votesService: VotesService) {}

  @Mutation(() => Vote)
  vote(@Args('voteInput') voteInput: VoteInput) {
    console.log('VOTE_INPUT', voteInput);
    return this.votesService.vote();
  }
}
