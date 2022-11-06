import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { parseValidationErrors } from 'src/helpers/parseValidationErrors';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async create({ username, password, email }: CreateUserInput) {
    try {
      let errors: any = {};
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
      const validationErrors = await validate(user);
      errors = parseValidationErrors(validationErrors);

      if (Object.keys(errors).length) {
        console.log('errors', errors);
        throw { errors };
      }

      return this.userRep.save(user);
    } catch (err) {
      console.log('insdie catch', err);
      return new Error(JSON.stringify(err));
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRep.find();
  }

  findOne(id: number) {
    return this.userRep.findOneBy({ id });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
