import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Post Schema
 */

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dashboard: {
    main: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Widget'
    },
    first_submain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Widget'
    },
    second_submain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Widget'
    },
    third_submain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Widget'
    }
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    content: {
      type: String,
      required: false,
      trim: true
    }
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  }],
  pictures: [{
    location: {
      type: String,
      required: false,
      trim: true
    },
    name: {
      type: String,
      required: false,
      trim: true
    },
    originalName: {
      type: String,
      required: false,
      trim: true
    }
  }],
  tags: [{
    type: String,
    trim: true,
    required: false
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


/**
 * Statics
 */
PostSchema.statics = {
  /**
   * Get Post
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('comments.user dashboard.main dashboard.first_submain dashboard.second_submain dashboard.third_submain user', 'username picture data definition widgetType entity filters dateFilters baseColumn category')
      .exec()
      .then((post) => {
        if (post) {
          return post;
        }
        const err = new APIError('Post id does not exist', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * Count the number of posts of a user
   * @param  { integer } id user id
   * @return { }    [description]
   */
  countUserPosts(user) {
    return this.find()
      .where({ user })
      .count()
      .exec()
      .then(count => count);
  },

  /**
   * List post in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .populate('comments.user dashboard.main', 'username picture data definition widgetType entity filters dateFilters baseColumn category')
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * Get a users feed
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<Post[]>}
   */
  filterFeed({ skip = 0, limit = 15, following = [] } = {}) {
    return this.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate('comments.user dashboard.main user', 'username picture data definition widgetType entity filters dateFilters baseColumn category')
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * Get most liked posts
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<Post[]>}
   */
  mostLiked(limit, skip) {
    return this.find()
      .sort({ 'likes.length': -1 })
      .populate('comments.user dashboard.main', 'username picture data definition widgetType entity filters dateFilters baseColumn category')
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};
export default mongoose.model('Post', PostSchema);
