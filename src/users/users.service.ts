import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  create(createUserInput: CreateUserInput) {
    const newUser = this.userRep.create(createUserInput);

    return this.userRep.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRep.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
