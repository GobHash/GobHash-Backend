import httpStatus from 'http-status';
import User from '../models/user.model';
import Post from '../models/post.model';

/**
 *  GET basic user stats.
 *  Followers, Following, Post Count.
 *  @param { string } userId - User identification.
 *  @returns { object } statistics usage.
 */
const userStats = async (req, res, next) => {
  try {
    const user = await User.get(req.params.userId);
    const followers = user.followers.length;
    const following = user.following.length;
    const posts = await Post.countUserPosts(user);

    return res.json({
      followers,
      following,
      posts
    }).status(httpStatus.OK);
  } catch (err) {
    return next(err);
  }
};

export default {
  userStats
};
