import Joi from 'joi';

export default {
  // POST /v1/users
  createUser: {
    body: {
      username: Joi.string().max(30).required(),
      email: Joi.string().regex(/^([\w-.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})$/).required(),
      password: Joi.string().min(5).max(30).required()
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
      password: Joi.string().min(5).max(30).required()
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
      layout: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      tags: Joi.array()
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
      username: Joi.string().max(30).required(),
      biography: Joi.string().max(200).required(),
      occupation: Joi.string().max(200).required()
    }
  }
};
