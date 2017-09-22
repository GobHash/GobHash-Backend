import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../../config/param-validation';
import operationCtrl from '../controllers/operation.controller';
import config from '../../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/operations')
  .get(
    operationCtrl.getOperations
  );

export default router;