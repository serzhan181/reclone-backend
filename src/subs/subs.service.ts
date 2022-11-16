import { Sub } from './entities/sub.entity';
import { User } from 'src/users/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubInput } from './dto/create-sub.input';
import { UpdateSubInput } from './dto/update-sub.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubsService {
  constructor(@InjectRepository(Sub) private subRep: Repository<Sub>) {}

  async create(createSubInput: CreateSubInput, creator: User) {
    // Check for existence
    try {
      const errors: any = {};
      const { name } = createSubInput;
      const subExists = await this.subRep.findBy({ name });

      if (subExists.length) errors.name = 'Sub with that name already exists.';

      if (Object.keys(errors).length) throw { errors };
    } catch (err) {
      throw new HttpException(JSON.stringify(err), HttpStatus.BAD_REQUEST);
    }

    // Create sub
    try {
      const sub = this.subRep.create({ ...createSubInput, creator });

      return sub.save();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return;
  }

  findAll() {
    return this.subRep.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} sub`;
  }

  update(id: number, updateSubInput: UpdateSubInput) {
    return `This action updates a #${id} sub`;
  }

  remove(id: number) {
    return `This action removes a #${id} sub`;
  }
}
