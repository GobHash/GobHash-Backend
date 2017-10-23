import Joi from 'joi';

export default {
  // POST /v1/users
  createUser: {
    body: {
      username: Joi.string().max(30).required(),
      email: Joi.string().regex(/^([\w-.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})$/).required(),
      password: Joi.string().min(4).max(30).required()
    }
  },

  // UPDATE /v1/users/:userId
  updateUser: {
    body: {
      username: Joi.string().max(30).required(),
      email: Joi.string().regex(/^([\w-.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },
  // POST v1/users/picture
  uploadPicture: {
    body: {
      username: Joi.string().max(30).required()
    }
  },
  // POST /v1/users/password/change
  passwordChange: {
    body: {
      token: Joi.string().required(),
      password: Joi.string().min(4).max(30).required()
    }
  },
  // POST v1/users/biography
  updateBio: {
    body: {
      username: Joi.string().required(),
      biography: Joi.string().max(140).required()
    }
  },
  // POST v1/users/follow
  followUser: {
    body: {
      username: Joi.string().required()
    }
  },
  // POST /v1/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  // GET /v1/auth/reset/:token
  resetToken: {
    params: {
      token: Joi.string().hex().required()
    }
  },
  // POST v1/post
  createPost: {
    body: {
      title: Joi.string().max(100).required(),
      description: Joi.string().max(500).required(),
      dasbhoard: {
        main: Joi.object().required(),
        first_submain: Joi.object(),
        second_subdomain: Joi.object(),
        third_submain: Joi.object()
      }
    }
  },
  // DELETE v1/post/delete
  deletePost: {
    body: {
      postId: Joi.string().required()
    }
  },
  // POST v1/post/comment
  addComment: {
    body: {
      postId: Joi.string().required(),
      content: Joi.string().required()
    }
  },
  // DELETE v1/post/comment
  deleteComment: {
    body: {
      postId: Joi.string().required(),
      commentId: Joi.string().required()
    }
  },
  // POST v1/post/like
  addLike: {
    body: {
      postId: Joi.string().required()
    }
  },
  // GET v1/stats/user/:userId
  statsUser: {
    params: {
      userId: Joi.string().required()
    }
  },
  // GET v1/stats/post
  statsPost: {
    query: {
      limit: Joi.number().greater(-1),
      skip: Joi.number().greater(-1)
    }
  },
  // POST v1/post/tag
  addTag: {
    body: {
      postId: Joi.string().required(),
      tag: Joi.string().max(50).required()
    }
  },
  // POST v1/users/profile
  profile: {
    body: {
      biography: Joi.string().max(200).required(),
      occupation: Joi.string().max(200).required()
    }
  },
  // POST v1/users/password/update
  passwordUpdate: {
    body: {
      currentPassword: Joi.string().required(),
      password: Joi.string().min(4).max(30).required()
    }
  },
  // GET v1/post/like/validate/:postId/:userId
  validateLike: {
    params: {
      userId: Joi.string().min(1).required(),
      postId: Joi.string().min(1).required()
    }
  },
  // GET v1/users/follow/:userId/check
  checkFollow: {
    params: {
      userId: Joi.string().min(1).required()
    }
  }

};
