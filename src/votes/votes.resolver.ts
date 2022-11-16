import { Resolver } from '@nestjs/graphql';
import { VotesService } from './votes.service';

@Resolver()
export class VotesResolver {
  constructor(private readonly votesService: VotesService) {}
}
