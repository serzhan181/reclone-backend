import { User } from './entities/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async create({ username, password, email }: CreateUserInput) {
    try {
      const errors: any = {};
      const usernameExists = await this.userRep.findOneBy({ username });
      const emailExists = await this.userRep.findOneBy({ email });

      if (usernameExists) errors.username = ['Username is already taken.'];
      if (emailExists) errors.email = ['Email is already taken.'];
      if (Object.keys(errors).length) {
        console.log('error occured', errors);
        throw { errors };
      }

      const user = this.userRep.create({
        username,
        email,
        password,
      });

      if (Object.keys(errors).length) {
        console.log('errors', errors);
        throw { errors };
      }

      return this.userRep.save(user);
    } catch (err) {
      console.log('insdie catch', err);
      throw new HttpException(JSON.stringify(err), HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRep.find();
  }

  findOne(username: string) {
    return this.userRep.findOneBy({ username });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
