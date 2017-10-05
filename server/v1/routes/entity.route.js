import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../../config/param-validation';
import entityCtrl from '../controllers/entity.controller';
import config from '../../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/entities')
  .get(
    entityCtrl.getEntities
  );

export default router;