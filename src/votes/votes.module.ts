import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesResolver } from './votes.resolver';

@Module({
  providers: [VotesResolver, VotesService],
})
export class VotesModule {}
