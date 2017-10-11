import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    unique: false,
    lowercase: false,
    trim: true,
  },
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
      required: false,
      default: 'https://s3.us-east-2.amazonaws.com/gobhash/profile/profile.jpeg'
    },
    name: {
      type: String,
      required: false,
      default: 'default-unique-image'
    },
    originalName: {
      type: String,
      required: false,
      default: 'default-image'
    }
  },
  occupation: {
    type: String,
    trim: true,
    lowercase: false
  },
  biography: {
    type: String,
    trim: true,
    lowercase: false
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
  admin: {
    type: Boolean,
    default: false
  },
  online: {
    type: Boolean,
    default: false
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
      .select('name username biography createdAt updatedAt picture followers following')
      .populate('followers following', 'username biography picture online')
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
   * @param {number} limipt - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .select('name username biography createdAt updatedAt picture followers following')
      .populate('followers following', 'username biography picture')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * List all online clients
   *
   */
  listOnline() {
    return this.find()
      .select('name username following')
      .where({ online: true })
      .populate('following', 'username')
      .sort({ createdAt: -1 })
      .skip()
      .limit()
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);

