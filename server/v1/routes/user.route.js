import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../../config/param-validation';
import userCtrl from '../controllers/user.controller';
import config from '../../../config/config';
import upload from '../../../config/aws';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /v1/users - Get list of users */
  .get(expressJwt({ secret: config.jwtSecret }), userCtrl.list)

  /** POST /v1/users - Create new user */
  .post(
    validate(paramValidation.createUser),
    userCtrl.create);

router.route('/password/change')
  // PATCH /v1/users/password/change - Change Password
  .patch(
    validate(paramValidation.passwordChange),
    userCtrl.changePassword);

router.route('/password/update')
  // PATCH /v1/users/password/update - Update Password
  .patch(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.passwordUpdate),
    userCtrl.updatePassword
  );

router.route('/biography')
  /** PATCH v1/users/biography */
  .patch(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.updateBio),
    userCtrl.updateBio
  );

router.route('/picture')
  /** POST v1/users/picture */
  .post(
    expressJwt({ secret: config.jwtSecret }),
    upload.single('profile'),
    userCtrl.updatePicture
  );
router.route('/follow')
  /** POST v1/users/follow */
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.followUser),
    userCtrl.followUser
  );
router.route('/unfollow')
  /** POST v1/users/unfollow */
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.followUser),
    userCtrl.unfollowUser
  );

router.route('/profile')
  /** GET v1/users/profile */
  .get(
    expressJwt({ secret: config.jwtSecret }),
    userCtrl.profile
  )
  /** PATCH v1/users/profile */
  .patch(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.profile),
    userCtrl.profile
  );

router.route('/:userId')
  /** GET /v1/users/:userId - Get user */
  .get(expressJwt({ secret: config.jwtSecret }), userCtrl.get)

  /** PUT /v1/users/:userId - Update user */
  .put(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.updateUser),
    userCtrl.update)

  /** DELETE /v1/users/:userId - Delete user */
  .delete(expressJwt({ secret: config.jwtSecret }), userCtrl.remove);

router.route('/follow/:userId/check')
  /** GET /v1/users/follow/:userId/check */
  .get(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.checkFollow),
    userCtrl.checkFollow
  );

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);


export default router;
