import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import User from '../models/user.model';
import config from '../../../config/config';

const errorMessage = {
  name: 'UserNotFoundException',
  message: 'Authentication error',
  errors: []
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const login = (req, res) => {
  // fetch user from db
  User
  .findOne({
    where: {
      username: req.body.username
    }
  })
  .then((user) => {
    // check if user was found by username
    if (user !== null && user !== undefined) {
      bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (valid === true) {
          const token = jwt.sign({
            username: user.username
          }, config.jwtSecret, {
            expiresIn: '30 days'
          });
          return res.json({ token, username: user.username });
        }
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json(errorMessage);
         // password not valid
      });
    } else {
      // password doesn't mactch
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(errorMessage);
    }
  });
};

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber };
