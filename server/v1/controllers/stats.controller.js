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

    return res
      .status(httpStatus.OK)
      .json({
        followers,
        following,
        posts
      });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET most popular stats
 * @param  {string}   req.query.limit  limit the posts
 * @param  {string}   res.query.skip  skip the number of posts
 * @return { array }  array of posts
 */
const postStats = async (req, res, next) => {
  try {
    // default params of optional query params
    const { limit = 5, skip = 0 } = req.query;
    // query the most liked posts
    const posts = await Post.mostLiked(limit, skip);
    // return posts
    return res
      .status(httpStatus.OK)
      .json(posts);
  } catch (err) {
    return next(err);
  }
};

export default {
  userStats,
  postStats
};
