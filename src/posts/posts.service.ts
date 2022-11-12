import { User } from 'src/users/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';
import { FileUpload } from 'src/types/file.type';
import { join, extname, resolve as pathResolve } from 'path';
import { createWriteStream } from 'fs';
import { makeid } from 'src/helpers/makeId';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRep: Repository<Post>,
    @InjectRepository(User) private usersRep: Repository<User>,
  ) {}

  async create(createPostInput: CreatePostInput, user: User) {
    const { postImg } = createPostInput;
    let postImageFilename: string | null = null;

    if (Boolean(postImg)) {
      const filename = await this.uploadPostImg(postImg);
      postImageFilename = filename;
    }

    const post = this.postRep.create({
      ...createPostInput,
      user,
      postImgUrn: postImageFilename
        ? pathResolve(`upload/${postImageFilename}`)
        : null,
    });

    return this.postRep.save(post);
  }

  async uploadPostImg(postImg: Promise<FileUpload>): Promise<string> {
    const { filename, createReadStream, mimetype } = await postImg;
    if (!['image/jpeg', 'image/png'].includes(mimetype)) {
      throw new HttpException('file not an image.', HttpStatus.BAD_REQUEST);
    }

    console.log('INITIAL FILENAME', filename);
    console.log('EXT', extname(filename));
    const randomId = makeid(7);

    const newFilename = `${randomId}${extname(filename)}`;

    return new Promise(async (resolve) => {
      createReadStream()
        .pipe(createWriteStream(join(process.cwd(), `upload/${newFilename}`)))
        .on('finish', () => resolve(newFilename))
        .on('error', () => {
          new HttpException('Could not save image', HttpStatus.BAD_REQUEST);
        });
    });
  }

  findAll() {
    return this.postRep.find();
  }

  findOne(id: number) {
    return this.postRep.findOneBy({ id });
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number, user: User) {
    const post = await this.postRep.findOne({
      where: { id },
      relations: ['user'],
    });
    console.log('POST', post);

    const owner = await this.usersRep.findOneByOrFail({ id: post.user.id });

    if (owner.id !== user.id) {
      throw new HttpException(
        'You are not the owner of this post.',
        HttpStatus.FORBIDDEN,
      );
    }

    return post.remove();
  }
}
