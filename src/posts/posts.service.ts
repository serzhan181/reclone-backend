import { uploadImg } from './../helpers/uploadImg';
import { Sub } from './../subs/entities/sub.entity';
import { User } from 'src/users/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';
import { join } from 'path';
import { unlinkSync } from 'fs';
import { setUsersVoteOnPost } from 'src/helpers/set-users-vote-post';
import { Subscription } from 'src/subs/entities/subscription.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRep: Repository<Post>,
    @InjectRepository(User) private usersRep: Repository<User>,
    @InjectRepository(Sub) private subRep: Repository<Sub>,
    @InjectRepository(Subscription)
    private subscriptionRep: Repository<Subscription>,
  ) {}

  async create(createPostInput: CreatePostInput, user: User) {
    const { postImg, subName } = createPostInput;
    let postImageFilename: string | null = null;

    if (Boolean(postImg)) {
      const filename = await uploadImg(postImg);
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

  async findAll(user: User, forUserSubscribed: boolean) {
    if (forUserSubscribed) {
      return this.findAllUserSubscribed(user);
    }

    const posts = await this.postRep.find({
      relations: ['user', 'votes', 'comments', 'comments.votes', 'sub'],
      order: { createdAt: 'DESC' },
    });

    posts.forEach((p) => p.setUserVote(user));
    return posts;
  }

  async findAllUserSubscribed(user: User) {
    const posts: Post[] = [];

    if (!user) return posts;

    const subscription = await this.subscriptionRep.find({
      where: {
        subscriber: { username: user.username },
      },
      relations: ['subscribedTo'],
    });

    const subscribedSubNames = subscription.map((s) => s.subscribedTo.name);

    for (const subName of subscribedSubNames) {
      const post = await this.postRep.findOne({
        where: { subName },
        relations: ['user', 'votes', 'comments', 'comments.votes', 'sub'],
        order: { createdAt: 'DESC' },
      });

      if (post) posts.push(post);
    }

    console.log('posts', posts);

    if (!posts.length) return posts;

    posts.forEach((p) => p.setUserVote(user));

    return posts;
  }

  async findOne(identifier: string, slug: string, user: User) {
    const post = await this.postRep.findOne({
      where: { identifier, slug },
      relations: ['comments', 'comments.votes', 'votes', 'user', 'sub'],
      order: { comments: { createdAt: 'DESC' } },
    });

    setUsersVoteOnPost(post, user, true);
    return post;
  }

  async findPostsBySubname(subName: string, user: User) {
    const posts = await this.postRep.find({
      where: { subName },
      relations: ['comments', 'comments.votes', 'votes', 'user', 'sub'],
    });

    posts.forEach((p) => p.setUserVote(user));
    return posts;
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
