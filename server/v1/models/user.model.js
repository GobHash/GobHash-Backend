import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  picture: {
    location: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    originalName: {
      type: String,
      required: false
    }
  },
  biography: {
    type: String,
    trim: true,
    lowercase: true
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpiration: {
    type: Date
  },
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
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .select('username biography createdAt updatedAt picture followers following')
      .populate('followers following', 'username biography picture')
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('User id does not exist', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .select('username biography createdAt updatedAt picture followers following')
      .populate('followers following', 'username biography picture')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
