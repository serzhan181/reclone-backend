import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { Sub } from './entities/sub.entity';
import { User } from 'src/users/entities/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRep: Repository<Subscription>,
  ) {}

  async subscribe(subscribedTo: Sub, subscriber: User) {
    const alreadySubscribed = await this.subscriptionRep.findOneBy({
      subscribedTo: { id: subscribedTo.id },
      subscriber: { id: subscriber.id },
    });

    if (alreadySubscribed)
      throw new HttpException(
        'You are already subscribed',
        HttpStatus.BAD_REQUEST,
      );

    const subscription = this.subscriptionRep.create({
      subscribedTo,
      subscriber,
    });
    return subscription.save();
  }

  async unsubscribe(subscribedTo: Sub, subscriber: User) {
    try {
      const subscription = await this.subscriptionRep.findOneBy({
        subscribedTo: { id: subscribedTo.id },
        subscriber: { id: subscriber.id },
      });

      if (!subscription) {
        throw 'You are not even subscribed to this community!';
      }
      return subscription.remove();
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
