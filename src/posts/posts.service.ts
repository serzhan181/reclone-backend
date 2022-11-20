import { Sub } from './../subs/entities/sub.entity';
import { User } from 'src/users/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';
import { FileUpload } from 'src/types/file.type';
import { join, extname } from 'path';
import { createWriteStream, unlinkSync } from 'fs';
import { makeid } from 'src/helpers/makeId';
import { setUsersVoteOnPost } from 'src/helpers/set-users-vote-post';
import { Vote } from 'src/votes/entities/vote.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRep: Repository<Post>,
    @InjectRepository(User) private usersRep: Repository<User>,
    @InjectRepository(Sub) private subRep: Repository<Sub>,
  ) {}

  async create(createPostInput: CreatePostInput, user: User) {
    const { postImg, subName } = createPostInput;
    let postImageFilename: string | null = null;

    if (Boolean(postImg)) {
      const filename = await this.uploadPostImg(postImg);
      postImageFilename = filename;
    }

    const sub = await this.subRep.findOneByOrFail({ name: subName });

    const post = this.postRep.create({
      ...createPostInput,
      user,
      sub,
      postImgUrn: postImageFilename,
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
        .pipe(createWriteStream(join(process.cwd(), `public/${newFilename}`)))
        .on('finish', () => resolve(newFilename))
        .on('error', () => {
          new HttpException('Could not save image', HttpStatus.BAD_REQUEST);
        });
    });
  }

  async findAll(user: User) {
    const posts = await this.postRep.find({
      relations: ['user', 'votes', 'comments', 'comments.votes'],
      order: { createdAt: 'DESC' },
    });

    posts.forEach((p) => p.setUserVote(user));
    return posts;
  }

  async findOne(identifier: string, slug: string, user: User) {
    const post = await this.postRep.findOne({
      where: { identifier, slug },
      relations: ['comments', 'comments.votes', 'votes', 'user'],
    });

    setUsersVoteOnPost(post, user);
    return post;
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number, user: User) {
    const post = await this.postRep.findOne({
      where: { id },
      relations: ['user'],
    });

    const owner = await this.usersRep.findOneByOrFail({ id: post.user.id });

    console.log('USER', user);

    if (owner.id !== user.id) {
      throw new HttpException(
        'You are not the owner of this post.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (post?.postImgUrn) {
      unlinkSync(join(__dirname, '..', 'public', post.postImgUrn));
    }

    return post.remove();
  }
}
