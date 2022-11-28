import { Sub } from './entities/sub.entity';
import { User } from 'src/users/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubInput } from './dto/create-sub.input';
import { UpdateSubInput } from './dto/update-sub.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadSubImages } from './dto/upload-sub-images';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { uploadImg } from 'src/helpers/uploadImg';

const publicSubs = join(__dirname, '..', '..', '..', 'public', 'subs');

// TODO: Refactor so that create func reveives 2 params (CreateSubInput, UploadSubImages). Reuse what is already created.

@Injectable()
export class SubsService {
  constructor(@InjectRepository(Sub) private subRep: Repository<Sub>) {}

  async create(createSubInput: CreateSubInput, creator: User) {
    // Check for existence
    try {
      const errors: any = {};
      const { name } = createSubInput;
      const subExists = await this.subRep.findBy({ name });

      console.log('exists', subExists);

      if (subExists.length) {
        errors.name = 'Sub with that name already exists.';
      }

      if (Object.keys(errors).length) {
        throw { errors };
      }
    } catch (err) {
      console.log('inside catch');
      throw new HttpException(JSON.stringify(err), HttpStatus.BAD_REQUEST);
    }

    // Create sub

    let bannerUrn: string | null = null;
    let subUrn: string | null = null;

    const { bannerImg = null, subImg = null } = createSubInput;

    if (bannerImg) bannerUrn = await uploadImg(bannerImg, 'subs');
    if (subImg) subUrn = await uploadImg(subImg, 'subs');

    const sub = this.subRep.create({
      ...createSubInput,
      bannerUrn,
      subImgUrn: subUrn,
      creator,
    });

    return sub.save();
  }

  findAll() {
    return this.subRep.find({ relations: ['subscribers'] });
  }

  async findOneByName(name: string, userId?: number) {
    const sub = await this.subRep.findOne({
      where: { name },
      relations: ['subscribers', 'subscribers.subscriber'],
    });

    if (!sub)
      throw new HttpException(
        'There is not community with such name!',
        HttpStatus.BAD_REQUEST,
      );

    sub.setIsUserSubscribed(userId || -1);
    return sub;
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
      const oldFilename = sub?.bannerUrn;
      console.log('bannerold', oldFilename);
      if (oldFilename && existsSync(join(publicSubs, oldFilename))) {
        unlinkSync(join(publicSubs, oldFilename));
      }

      const filename = await uploadImg(bannerImg, 'subs');
      bannerUrn = filename;
    }

    if (Boolean(subImg)) {
      const oldFilename = sub?.subImgUrn;
      if (oldFilename && existsSync(join(publicSubs, oldFilename))) {
        unlinkSync(join(publicSubs, oldFilename));
      }

      const filename = await uploadImg(subImg, 'subs');
      subUrn = filename;
    }

    if (bannerUrn) await this.subRep.update({ name }, { bannerUrn });
    if (subUrn) await this.subRep.update({ name }, { subImgUrn: subUrn });

    return this.subRep.findOneBy({ name });
  }

  async findSubsPopular(userId: number) {
    // Find 5 most popular communities
    const [subs] = await this.subRep.findAndCount({
      relations: ['subscribers', 'subscribers.subscriber'],
      take: 5,
      skip: 0,
    });

    subs.forEach((s) => s.setIsUserSubscribed(userId || -1));

    return subs.sort((s1, s2) => s2.subsribersCount - s1.subsribersCount);
  }

  async updateDescription(updateSubInput: UpdateSubInput) {
    if (updateSubInput.description) {
      await this.subRep.update(
        { name: updateSubInput.name },
        { description: updateSubInput.description },
      );
    }
    return this.findOneByName(updateSubInput.name);
  }

  remove(id: number) {
    return `This action removes a #${id} sub`;
  }
}
