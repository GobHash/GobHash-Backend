import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../../config/param-validation';
import authCtrl from '../controllers/auth.controller';
import config from '../../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

/**
 * POST /v1/auth/login - Returns token if correct username and password is provided
 */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/**
 * GET /v1/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number')
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);

/**
 * POST v1/auth/reset/
 * send reset email and activate 1 hour reset token
 */
router.route('/reset')
  .post(authCtrl.resetPassword);

/**
 * GET v1/reset/:token
 * get valid username on valid reset token
 */
router.route('/reset/:token')
  .get(validate(paramValidation.resetToken), authCtrl.validateResetToken);

export default router;
