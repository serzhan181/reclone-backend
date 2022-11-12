import { User } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRep: Repository<Post>) {}

  create(createPostInput: CreatePostInput, user: User) {
    const post = this.postRep.create({ ...createPostInput, user });

    return this.postRep.save(post);
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

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
