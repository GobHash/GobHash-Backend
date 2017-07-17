import Post from '../models/post.model';

// Create
const create = async (req, res) => {
  try {
    const user = req.user.id;
    const post = await new Post({
      user,
      layout: req.body.layout,
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags
    });
    await post.save();
    return res.json(post);
  } catch (e) {
    return res.json(e);
  }
};

// Read
const get = async (req, res) => {
  try {
    const post = await Post.get(req.params.postId);
    return res.json(post);
  } catch (e) {
    return res.json(e);
  }
};
/**
 * Get post list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
const list = async (req, res) => {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const posts = await Post.list({ limit, skip });
    return res.json(posts);
  } catch (e) {
    return res.json(e);
  }
};
/**
 * Add comment to post
 * @property {ObjectId} req.body.postId - Object Id of post
 * @property {ObjectId} req.body.content - String of comment content
 * @returns {User[]}
 */
const addComment = async (req, res) => {
  try {
    // find post
    const post = await Post.get(req.body.postId);
    const user = req.user.id;
    // add comment to post
    post.comments.push({
      user,
      content: req.body.content
    });
    await post.save();
    return res.json(post.comments[post.comments.length - 1]);
  } catch (e) {
    return res.json(e);
  }
};
/**
 * Delete comment from post
 * @property {ObjectId} req.body.postId - Object Id of post
 * @property {ObjectId} req.body.commentId - String of comment content
 * @returns {User[]}
 */
const deleteComment = async (req, res) => {
  try {
    // find post
    const post = await Post.get(req.body.postId);
    // find comment
    const comment = await post.comments.id(req.body.commentId);
    // remove from list
    post.comments.pull(comment);
    // save changes
    await post.save();
    return res.json(comment);
  } catch (e) {
    return res.json(e);
  }
};

/**
 * Delete post
 * @param  {ObjectId} req.body.postId - Object Id of post
 */
const remove = async (req, res) => {
  try {
    // find post
    const post = await Post.get(req.body.postId);
    // delete post
    await post.remove();
    return res.json(post);
  } catch (e) {
    return res.json(e);
  }
};

/**
 * @property {ObjectId} req.body.postId - Object Id of post
 */
const addLike = async (req, res) => {
  try {
    // find post
    const post = await Post.get(req.body.postId);
    const user = req.user.id;
    const like = post.likes.find((_like) => { // eslint-disable-line
      return _like.user == user;              // eslint-disable-line
    });

    if (like) {
      return res.json({ msgerror: 'Post already liked by user' });
    }
    // add comment to post
    post.likes.push({
      user
    });
    await post.save();
    return res.json({ likes: post.likes.length });
  } catch (e) {
    return res.json(e);
  }
};

/**
 * Delete like
 * @param  {ObjectId} req.body.postId - Object Id of post
 */
const deleteLike = async (req, res) => {
  try {
    // find post
    const post = await Post.get(req.body.postId);
    // find like
    const like = post.likes.find((_like) => { // eslint-disable-line
      return _like.user == req.user.id;       // eslint-disable-line
    });

    if (!like) {
      return res.json({ msgerror: 'Post not liked' });
    }
    // remove from list
    post.likes.pull(like);
    // save changes
    await post.save();
    return res.json({ likes: post.likes.length });
  } catch (e) {
    return res.json(e);
  }
};

export default {
  create,
  get,
  list,
  addComment,
  deleteComment,
  remove,
  addLike,
  deleteLike
};
