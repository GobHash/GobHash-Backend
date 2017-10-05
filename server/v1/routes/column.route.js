import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../../config/param-validation';
import columnCtrl from '../controllers/column.controller';
import config from '../../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/columns/:id')
  .get(
    columnCtrl.getColumnsByEntity
  );

router.route('/columns')
  .get(
      columnCtrl.getColumns
  )

export default router;