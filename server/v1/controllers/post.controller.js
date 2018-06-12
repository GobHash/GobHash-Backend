import Post from '../models/post.model';
import User from '../models/user.model';
import Widget from '../models/widget.model';
import { emmiter } from '../../../index';
import mongoose from 'mongoose';
import httpStatus from 'http-status';

// Create
const create = async (req, res) => {
  try {
    const user = req.user.id;
    let widget = await new Widget(req.body.dashboard.main);
    const main = await widget.save();
    const post = await new Post({
      user,
      title: req.body.title,
      description: req.body.description
    });
    post.dashboard.main = main;
    if ('first_submain' in post.dashboard) {
      try {
        widget = await new Widget(req.body.dashboard.first_submain);
        const first_submain = await widget.save();
        post.dashboard.first_submain = first_submain;
      } catch (e) {

      }
    }
    if ('second_submain' in post.dashboard) {
      try {
        widget = await new Widget(req.body.dashboard.second_submain);
        const second_submain = await widget.save();
        post.dashboard.second_submain = second_submain;
      } catch (e) {

      }
    }
    if ('third_submain' in post.dashboard) {
      try{
        widget = await new Widget(req.body.dashboard.third_submain);
        const third_submain = await widget.save();
        post.dashboard.third_submain = third_submain;
      } catch (e) {

      }
    }
    const userQuery = await User.get(req.user.id);
    for (let i = 0; i < userQuery.followers.length; i++) { // eslint-disable-line
      const follower = userQuery.followers[i];
      if (follower.online) {
        let postWithUser = post;
        // assign username for post render
        postWithUser.user.username = req.user.username;
        emmiter.sendToUser(follower, postWithUser);
      }
    }
    const savedPost = await post.save();
    return res
      .status(httpStatus.CREATED)
      .json(savedPost);
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
    return res.json({ deleted: true });
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

/**
 * Get a user's posts
 */
const userFeed = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.getUserFeed(userId);
    return res.json(posts);
  } catch (e) {
    console.log(e);
    return res.json(e);
  }
};

/**
 * Get the feed for a user
 * @param  req.param.userId The users id
 * @param  req.query.limit
 * @param  req.query.lastPost Last Id Post
 */
const feed = async (req, res) => {
  try {
    const { limit = 15, skip = 0 } = req.query;
    const user = await User.get(req.params.userId);
    const following = user.following;
    const posts = await Post.filterFeed({ limit, skip, following });
    return res.json(posts);
  } catch (e) {
    return res.json(e);
  }
};

const addTag = async (req, res) => {
  try {
    const post = await Post.get(req.body.postId);
    post.tags.push(req.body.tag);
    await post.save();
    return res.json(post);
  } catch (e) {
    return res.json(e);
  }
};

const removeTag = async (req, res) => {
  try {
    let removed = 0;
    const post = await Post.get(req.body.postId);
    for (let i = 0; i < post.tags.length; i++) { //eslint-disable-line
      const tag = post.tags[i];
      if (tag.includes(req.body.tag)) {
        post.tags.pull(tag);
        removed += 1;
      }
    }
    await post.save();
    return res.json({ post, removed });
  } catch (e) {
    return res.json(e);
  }
};
/**
 * Check if user can like post
 * @param  {string} req.params.userId User Id
 * @param  {string} req.params.postID Post Id
 * @return {boolean} True can like, False otherwise
 */
const checkValidLike = async (req, res) => {
  try {
    // find post
    const post = await Post.get(req.params.postId);
    const likes = post.likes;
    if ((likes.filter((l) => { return l.user == req.params.userId })).length !== 0) {
      return res.json({
        userId: req.params.userId,
        canLike: false,
        msg: 'User already liked this post'
      });
    }
    // if user is not in already in liked
    // then user can like
    return res.json({
      userId: req.params.userId,
      canLike: true,
      msg: 'User has not liked this post'
    });


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
  deleteLike,
  addTag,
  removeTag,
  userFeed,
  feed,
  checkValidLike
};
