import { User } from './../users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Post) private postRep: Repository<Post>,
    @InjectRepository(Comment) private commentRep: Repository<Comment>,
  ) {}

  async create(createCommentInput: CreateCommentInput, user: User) {
    try {
      const { postIdentifier, postSlug, body } = createCommentInput;

      const post = await this.postRep.findOneByOrFail({
        identifier: postIdentifier,
        slug: postSlug,
      });

      const comment = this.commentRep.create({ post, body, user });

      return comment.save();
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentInput: UpdateCommentInput) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
