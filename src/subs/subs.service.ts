import { bucket } from 'src/utils/b2';
import { Sub } from './entities/sub.entity';
import { User } from 'src/users/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubInput } from './dto/create-sub.input';
import { UpdateSubInput } from './dto/update-sub.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UploadSubImages } from './dto/upload-sub-images';

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

    if (bannerImg)
      bannerUrn = await bucket.uploadImage(await bannerImg, 'subs');
    if (subImg) subUrn = await bucket.uploadImage(await subImg, 'subs');

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

  async findOneByName(name: string, userId?: string) {
    const sub = await this.subRep.findOne({
      where: { name },
      relations: ['subscribers', 'subscribers.subscriber'],
    });

    if (!sub)
      throw new HttpException(
        'There is not community with such name!',
        HttpStatus.BAD_REQUEST,
      );

    sub.setIsUserSubscribed(userId || '-1');
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
      const fileId = sub?.bannerUrn;
      console.log('bannerold', fileId);
      if (fileId) {
        await bucket.deleteImage(fileId);
      }

      bannerUrn = await bucket.uploadImage(await bannerImg, 'subs');
    }

    if (Boolean(subImg)) {
      const fileId = sub?.subImgUrn;
      if (fileId) {
        await bucket.deleteImage(fileId);
      }

      subUrn = await bucket.uploadImage(await subImg, 'subs');
    }

    if (bannerUrn) await this.subRep.update({ name }, { bannerUrn });
    if (subUrn) await this.subRep.update({ name }, { subImgUrn: subUrn });

    return this.subRep.findOneBy({ name });
  }

  async findSubsPopular(userId: string) {
    // Find 5 most popular communities
    const [subs] = await this.subRep.findAndCount({
      relations: ['subscribers', 'subscribers.subscriber'],
      take: 5,
      skip: 0,
    });

    subs.forEach((s) => s.setIsUserSubscribed(userId || '-1'));

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

  async findSubsSearch(term: string) {
    return this.subRep.find({
      where: {
        name: Like(`%${term}%`),
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} sub`;
  }
}
