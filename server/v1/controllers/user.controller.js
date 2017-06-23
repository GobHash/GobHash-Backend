import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import User from '../models/user.model';


/**
 * Load user and append to req.
 */
const load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.user = user; // eslint-disable-line no-param-reassign
  } catch (err) {
    console.log(err) // eslint-disable-line
  }

  return next();
};

/**
 * Get user
 * @returns {User}
 */
const get = (req, res) => {
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
};

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.password - The passwrod of user.
 * @returns {User}
 */
const create = async (req, res) => {
  try {
    const [hashPassword, hashEmail] = await Promise.all(
      [
        bcrypt.hash(req.body.password, 10),
        bcrypt.hash(req.body.email, 10)
      ]);
    const user = await new User({
      username: req.body.username,
      email: hashEmail,
      password: hashPassword
    });
    const modUser = {
      id: user.id,
      username: user.username
    };
    await user.save();
    return res.json(modUser);
  } catch (e) {
    return res.json(e);
  }
};

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.email    - The email of user.
 * @returns {User}
 */
const update = async (req, res) => {
  const user = req.user;
  if (user !== null) {
    const email = await bcrypt.hash(req.body.email, 10);
    user.username = req.body.username;
    user.email = email;
    await user.save();
    return res.json(user);
  }
  const errorMessage = {
    name: 'UserNotFoundException',
    message: 'User id does not exist',
    errors: []
  };
  return res
    .status(httpStatus.NOT_FOUND)
    .json(errorMessage);
};

/**
 * Change User Password
 * @property {number} req.body.username - Username of User
 * @property {number} req.body.password - New password
 * @returns {User[]}
 */
const changePassword = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiration = undefined;
    await user.save();
    return res.json('Password changed');
  } catch (e) {
    const errorMessage = {
      name: e.name,
      message: e.message,
      errors: e.errors
    };
    return res
      .status(httpStatus.NOT_FOUND)
      .json(errorMessage);
  }
};

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
const list = async (req, res) => {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const users = await User.list({ limit, skip });
    return res.json(users);
  } catch (e) {
    const errorMessage = {
      name: e.name,
      message: e.message,
      errors: e.errors
    };
    // send only necesarry error message
    return res.json(errorMessage);
  }
};

/**
 * Delete user.
 * @returns {User}
 */
const remove = async (req, res) => {
  const user = req.user;
  if (user === null && user === undefined) {
    const errorMessage = {
      name: 'UserNotFoundException',
      message: 'User id does not exist',
      errors: []
    };
    return res.json(errorMessage);
  }
  try {
    await user.remove();
    const modUser = {
      id: user._id,
      username: user.username
    };
    return res.json(modUser);
  } catch (e) {
    const errorMessage = {
      name: e.name,
      message: e.message,
      errors: e.errors
    };
    // send only necesarry error message
    return res.json(errorMessage);
  }
};

export default { load, get, create, update, list, remove, changePassword };
