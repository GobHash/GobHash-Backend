import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../../config/param-validation';
import widgetCtrl from '../controllers/widget.controller';
import config from '../../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

/**
 * POST v1/auth/reset/
 * send reset email and activate 1 hour reset token
 */
router.route('/preview')
  .post(widgetCtrl.getDataForPreview);

export default router;