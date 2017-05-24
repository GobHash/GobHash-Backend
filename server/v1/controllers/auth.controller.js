import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import User from '../models/user.model';
import email from '../helpers/email';
import config from '../../../config/config';

const errorMessage = {
  name: 'UserNotFoundException',
  message: 'Authentication error',
  errors: []
};

const unathorizedMesssage = {
  name: 'UnathorizedException',
  message: 'Authentication error',
  errors: [{ email: 'Not matched' }]
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const login = async (req, res) => {
  // fetch user from db
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (valid === true) {
      const token = jwt.sign({
        username: user.username
      }, config.jwtSecret, {
        expiresIn: '30 days'
      });
      return res.json({ token, username: user.username });
    }
    // password not valid
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(errorMessage);
  } catch (e) {
    // check if user was found by username
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(errorMessage);
  }
};

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
const getRandomNumber = async (req, res) => {
  // req.user is assigned by jwt middleware if valid token is provided
  const response = {
    user: req.user,
    num: Math.random() * 100
  };
  return res.json(response);
};

/**
 * Send Reset Password Token
 * @param req
 * @param res
 * @returns json response
 */
const resetPassword = async (req, res) => {
  //  check if users exists in database
  //  req.body.email
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    const valid = await bcrypt.compare(req.body.email, user.email);
    if (valid === false) {
      return res.status(httpStatus.UNAUTHORIZED).json(unathorizedMesssage);
    }
    //  set reset token and expiration date
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpiration = Date.now() + 3600000;  // 1 hour from now
    await user.save();
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    const data = {
      from: 'GobHash <me@samples.mailgun.org>',
      to: req.body.email,
      subject: 'Reestablecer Contraseña',
      text: resetURL
    };
    //  send email to reset it.
    email.sendEmail(data, { username: user.username });
    return res.json('Email Sent');
  } catch (e) {
    // user not found
    return res.status(404).json('User not found');
  }
};

export default { login, getRandomNumber, resetPassword };
