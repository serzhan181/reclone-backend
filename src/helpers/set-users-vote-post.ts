import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';

export const setUsersVoteOnPost = (
  post: Post,
  user: User,
  isSetVoteOnComments = false,
) => {
  if (!user) return post;
  post.setUserVote(user);
  if (isSetVoteOnComments) {
    post.comments.forEach((c) => c.setUserVote(user));
  }

  return post;
};
