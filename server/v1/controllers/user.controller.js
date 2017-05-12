import bcrypt from 'bcrypt';
import User from '../models/user.model';
import httpStatus from 'http-status';


/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User
  .findOne({
    where: {
      id
    }
  })
  .then((user) => {
    req.user = user; // eslint-disable-line no-param-reassign
    return next();
  })
  .catch((e) => {
    const errorMessage = {
      name: e.name,
      message: e.message,
      errors: e.errors
    };
    // send only necesarry error message
    return res
      .status(httpStatus.NOT_FOUND)
      .json(errorMessage);
  });
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  if (req.user !== null && req.user !== undefined) {
    return res.json(req.user);
  }
  const errorMessage = {
    name: 'UserNotFoundException',
    message: 'User id does not exist',
    errors: []
  };
  return res
    .status(httpStatus.NOT_FOUND)
    .json(errorMessage);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.password - The passwrod of user.
 * @returns {User}
 */
function create(req, res) {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: hash
    })
    .then(savedUser => res.json(savedUser))
    .catch((e) => {
      const errorMessage = {
        name: e.name,
        message: e.message,
        errors: e.errors
      };
      // send only necesarry error message
      res.json(errorMessage);
    });
  });
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res) {
  const user = req.user;
  if (user !== null && user !== undefined) {
    user.username = req.body.username;
    user.email = req.body.email;

    User.update({
      username: user.username,
      email: user.email
    }, {
      where: {
        id: user.id
      }
    })
    .then(res.json(user))
    .catch((e) => {
      const errorMessage = {
        name: e.name,
        message: e.message,
        errors: e.errors
      };
      // send only necesarry error message
      res.json(errorMessage);
    });
  } else {
    const errorMessage = {
      name: 'UserNotFoundException',
      message: 'User id does not exist',
      errors: []
    };
    return res
      .status(httpStatus.NOT_FOUND)
      .json(errorMessage);
  }
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res) {
  const { limit = 50, offset = 0 } = req.query;
  User.findAll({
    attributes: ['id', 'username', 'email'],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10)
  })
  .then(users => res.json(users))
  .catch((e) => {
    const errorMessage = {
      name: e.name,
      message: e.message,
      errors: e.errors
    };
    // send only necesarry error message
    res.json(errorMessage);
  });
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res) {
  const user = req.user;
  User.destroy({
    where: {
      id: user.id
    }
  })
  .then(res.json(user))
  .catch((e) => {
    const errorMessage = {
      name: e.name,
      message: e.message,
      errors: e.errors
    };
    // send only necesarry error message
    res.json(errorMessage);
  });
}

export default { load, get, create, update, list, remove };
