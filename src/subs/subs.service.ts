import { Sub } from './entities/sub.entity';
import { User } from 'src/users/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubInput } from './dto/create-sub.input';
import { UpdateSubInput } from './dto/update-sub.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadSubImages } from './dto/upload-sub-images';
import { join } from 'path';
import { unlinkSync } from 'fs';
import { uploadImg } from 'src/helpers/uploadImg';

const publicSubs = join(__dirname, '..', '..', '..', 'public', 'subs');

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

  findOneByName(name: string) {
    return this.subRep.findOneBy({ name });
  }

  async uploadSubImages({ name, bannerImg, subImg }: UploadSubImages) {
    const sub = await this.subRep.findOneByOrFail({ name });

    if (!bannerImg && !subImg) {
      return this.findOneByName(name);
    }

    let bannerUrn: string | null = null;
    let subUrn: string | null = null;

    if (Boolean(bannerImg)) {
      // delete previous image if exists
      const oldFilename = sub.bannerUrn;
      if (oldFilename) {
        unlinkSync(join(publicSubs, oldFilename));
      }

      const filename = await uploadImg(bannerImg, 'subs');
      bannerUrn = filename;
    }

    if (Boolean(subImg)) {
      const oldFilename = sub.subImgUrn;
      if (oldFilename) {
        unlinkSync(join(publicSubs, oldFilename));
      }

      const filename = await uploadImg(subImg, 'subs');
      subUrn = filename;
    }

    const updatedSub = await this.subRep
      .createQueryBuilder()
      .update()
      .set({ bannerUrn, subImgUrn: subUrn })
      .where('name = :name', { name })
      .execute();

    console.log('UPDATED RESULT', updatedSub);

    return this.subRep.findOneBy({ name });
  }

  update(id: number, updateSubInput: UpdateSubInput) {
    return `This action updates a #${id} sub`;
  }

  remove(id: number) {
    return `This action removes a #${id} sub`;
  }
}
