import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import User from '../models/user.model';

/**
 * Load user and append to req.
 */
const load = async (req, res, next, id) => {
  try {
    if (req.user === null || req.user === undefined) {
      const user = await User.get(id);
      req.user = user; // eslint-disable-line no-param-reassign
    }
    return next();
  } catch (err) {
    return next(err);
  }
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
    message: 'User id does not exist'
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
    const username = req.body.username;
    // check if username exists
    const countCheck = await User.where({ username }).count();
    // if there already exists a username
    if (countCheck > 0) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({
          code: 11000,
          errors: 'Duplicated user',
          fields_duplicated: {
            username
          }
        });
    }
    const user = await new User({
      username,
      email: hashEmail,
      password: hashPassword
    });
    if (req.body.name !== null && req.body.name !== undefined) {
      user.name = req.body.name;
    }
    const modUser = {
      id: user.id,
      username: user.username
    };
    await user.save();

    return res
      .status(httpStatus.OK)
      .json(modUser);
  } catch (e) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(e);
  }
};

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.email    - The email of user.
 * @returns {User}
 */
const update = async (req, res) => {
  const user = await User.get(req.params.userId);
  if (user !== null && user !== undefined) {
    const email = await bcrypt.hash(req.body.email, 10);
    user.username = req.body.username;
    user.email = email;
    user.updatedAt = Date.now();
    await user.save();
    return res
      .status(httpStatus.OK)
      .json(user);
  }
  const errorMessage = {
    name: 'UserNotFoundException',
    errmsg: 'User id does not exist'
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
    const user = await User.findOne({ resetPasswordToken: req.body.token });
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiration = undefined;
    user.updatedAt = Date.now();
    await user.save();
    return res.json('Password changed');
  } catch (e) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json(e);
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
    return res
      .status(httpStatus.OK)
      .json(users);
  } catch (e) {
    return res.json(e);
  }
};

/**
 * Delete user.
 * @returns {User}
 */
const remove = async (req, res) => {
  const user = await User.get(req.params.userId);
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
    return res
      .status(httpStatus.OK)
      .json(modUser);
  } catch (error) {
    return res.json(error);
  }
};

/**
 * Updates or creates the biography of user.
 * @returns string
 */
const updateBio = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    user.biography = req.body.biography;
    user.updatedAt = Date.now();
    await user.save();
    return res.json('biography updated');
  } catch (e) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json(e);
  }
};

/**
 * Set user's profile picture
 * @return string
 */
const updatePicture = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    user.picture.originalName = req.file.originalname;
    user.picture.name = req.file.key;
    user.picture.location = req.file.location;
    user.updatedAt = Date.now();
    const savedUser = await user.save();
    return res.json({
      username: savedUser.username,
      biography: savedUser.biography,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
      picture: savedUser.picture
    });
  } catch (e) {
    return res.json(e);
  }
};

/**
 * Follow another user
 * @return {String}operation status
 */
const followUser = async (req, res) => {
  try {
    const actualUserPromise = User.findOne({ username: req.user.username });
    const followUserPromise = User.findOne({ username: req.body.username });
    const [actual, follow] = await Promise.all([actualUserPromise, followUserPromise]);
    // validate user
    if (actual.username !== follow.username) {
      follow.followers.push(actual);
      actual.following.push(follow);
      await Promise.all([follow.save(), actual.save()]);
      return res.json({
        message: `${actual.username} followed ${follow.username}`
      });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json('bad operation');
  } catch (e) {
    return res.json(e);
  }
};

const unfollowUser = async (req, res) => {
  try {
    const actualUserPromise = User.findOne({ username: req.user.username });
    const followUserPromise = User.findOne({ username: req.body.username });
    const [actual, follow] = await Promise.all([actualUserPromise, followUserPromise]);
    // validate user
    if (actual.username !== follow.username) {
      follow.followers.pull(actual);
      actual.following.pull(follow);
      await Promise.all([follow.save(), actual.save()]);
      return res.json({
        message: `${actual.username} unfollowed ${follow.username}`
      });
    }
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json('bad operation');
  } catch (e) {
    return res.json(e);
  }
};

/**
 * GET or POST  the profile of a user
 * @param  {string} req.body.username
 * @param  {string} req.body.biography
 * @param  {string} req.body.occupation
 */
const profile = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const user = await User.findOne({ _id: req.user.id });

      return res.json({
        username: user.username,
        occupation: user.occupation,
        biography: user.biography
      });
    } else if (req.method === 'POST') {
      const user = await User.findOne({ _id: req.user.id });
      user.occupation = req.body.occupation;
      user.biography = req.body.biography;
      await user.save();
      return res.json({
        occupation: user.occupation,
        biography: user.biography
      });
    }
    return res.status(httpStatus.BAD_REQUEST).json('invalid request type');
  } catch (e) {
    return res.json(e);
  }
};

export default {
  load,
  get,
  create,
  update,
  list,
  remove,
  changePassword,
  updateBio,
  updatePicture,
  followUser,
  unfollowUser,
  profile
};
