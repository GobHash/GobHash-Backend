import Joi from 'joi';

export default {
  // POST /v1/users
  createUser: {
    body: {
      username: Joi.string().required(),
      email: Joi.string().regex(/^([\w-.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})$/).required(),
      password: Joi.string().required()
    }
  },

  // UPDATE /v1/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      email: Joi.string().regex(/^([\w-.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },
  // POST /v1/users/password/change
  passwordChange: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  // POST v1/users/biography
  updateBio: {
    body: {
      username: Joi.string().required(),
      biography: Joi.string().required()
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
  }
};
