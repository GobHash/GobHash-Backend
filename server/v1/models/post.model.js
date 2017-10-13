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
  data: [
    []
  ],
  definition: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    widgetType: {
      id: {
        type: Number
      },
      name: {
        type: String
      }
    },
    entity: {
      id: {
        type: Number
      },
      name: {
        type: String
      },
      visible: {
        type: Boolean
      },
      updatedAt: {
        type: Date
      },
      createdAt: {
        type: Date
      }
    },
    filters: [{
      hashKey: {
        type: String
      },
      column: {
        base_table: {
          type: String
        },
        entity_id: {
          type: Number
        },
        name: {
          type: String
        },
        type: {
          type: Number
        },
        updatedAt: {
          type: Date
        },
        createdAt: {
          type: Date
        }
      },
      operation: {
        id: {
          type: Number
        },
        name: {
          type: String
        },
        value_type: {
          type: Number
        },
        updatedAt: {
          type: Date
        },
        createdAt: {
          type: Date
        }
      },
      value: {
        type: String
      }
    }],
    dateFilters: [{
      hashKey: {
        type: String
      },
      column: {
        base_table: {
          type: String
        },
        entity_id: {
          type: Number
        },
        name: {
          type: String
        },
        type: {
          type: Number
        },
        updatedAt: {
          type: Date
        },
        createdAt: {
          type: Date
        }
      },
      operation: {
        id: {
          type: Number
        },
        name: {
          type: String
        },
        value_type: {
          type: Number
        },
        updatedAt: {
          type: Date
        },
        createdAt: {
          type: Date
        }
      },
      value: {
        type: String
      }
    }],
    baseColumn: {
      id: {
        type: Number
      },
      name: {
        type: String
      },
      base_type: {
        type: String
      },
      base_table: {
        type: String
      },
      second_table: {
        type: String
      },
      entity_id: {
        type: Number
      },
      createdAt: {
        type: Date
      },
      updatedAt: {
        type: Date
      }
    },
    category: {
      operation: {
        type: String
      },
      column: {
        type: String
      }
    },
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
      .populate('comments.user', 'username picture')
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
      .populate('comments.user', 'username picture')
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
      .populate('comments.user', 'username picture')
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};
export default mongoose.model('Post', PostSchema);
