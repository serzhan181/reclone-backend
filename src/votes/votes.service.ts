import { setUsersVoteOnPost } from './../helpers/set-users-vote-post';
import { User } from './../users/entities/user.entity';
import { Vote } from './entities/vote.entity';
import { VoteInput } from './dto/vote-input';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Post } from 'src/posts/entities/post.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Post) private postRep: Repository<Post>,
    @InjectRepository(Comment) private commentRep: Repository<Comment>,
    @InjectRepository(Vote) private voteRep: Repository<Vote>,
    @InjectRepository(User) private userRep: Repository<User>,
  ) {}

  async vote(voteInput: VoteInput, username: string) {
    const { value, commentId, postId } = voteInput;
    const user = await this.userRep.findOneBy({ username });

    if (![1, 0, -1].includes(value)) {
      throw new HttpException('Incorrect value', HttpStatus.BAD_REQUEST);
    }

    try {
      let post = await this.postRep.findOneByOrFail({ id: postId });
      let comment: Comment;
      let vote: Vote;

      if (commentId) {
        // IF it is voted on comment;
        comment = await this.commentRep.findOneBy({ id: commentId });
        vote = await this.voteRep.findOneBy({
          comment: { id: commentId },
          username,
        });
      } else {
        vote = await this.voteRep.findOneBy({
          username,
          post: { id: post.id },
        });
      }

      if (!vote && value === 0) {
        throw new HttpException(
          'No vote to reset post or comment to',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!vote) {
        vote = this.voteRep.create({ user, value });

        // Vote on post or comment;
        comment ? (vote.comment = comment) : (vote.post = post);

        await vote.save();
      }

      if (value === 0) {
        await vote.remove();
      }

      // new value passed, update vote
      if (vote.value !== value) {
        vote.value = value;
        await vote.save();
      }

      post = await this.postRep.findOne({
        where: { id: postId },
        relations: ['sub', 'comments', 'comments.votes', 'votes'],
      });

      setUsersVoteOnPost(post, user);

      if (commentId) {
        comment = post.comments.find((c) => c.id === commentId);
        comment.setUserVote(user);
        post.comments = [comment];
      }

      return post;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
