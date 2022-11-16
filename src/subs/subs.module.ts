import { Sub } from './entities/sub.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { SubsService } from './subs.service';
import { SubsResolver } from './subs.resolver';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sub]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UsersModule,
  ],
  providers: [SubsResolver, SubsService],
})
export class SubsModule {}
