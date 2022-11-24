import { Subscription } from './entities/subscription.entity';
import { Sub } from './entities/sub.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { SubsService } from './subs.service';
import { SubsResolver } from './subs.resolver';
import { JwtModule } from '@nestjs/jwt';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sub, Subscription]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UsersModule,
  ],
  providers: [SubsResolver, SubsService, SubscriptionService],
})
export class SubsModule {}
