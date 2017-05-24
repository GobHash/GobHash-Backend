import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../../config/param-validation';
import userCtrl from '../controllers/user.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /v1/users - Get list of users */
  .get(userCtrl.list)

  /** POST /v1/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  /** GET /v1/users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /v1/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /v1/users/:userId - Delete user */
  .delete(userCtrl.remove);

router.route('/password/change')
  // POST /v1/users/password/change - Change Password
  .post(userCtrl.changePassword);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;
