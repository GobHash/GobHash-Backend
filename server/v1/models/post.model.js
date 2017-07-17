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
  layout: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false
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
    type: Date
  },
  createdAt: {
    type: Date
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
   * List post in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .populate('comments.user', 'username picture')
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};
export default mongoose.model('Post', PostSchema);
