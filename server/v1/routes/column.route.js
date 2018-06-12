import express from 'express';
import columnCtrl from '../controllers/column.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/columns/:id')
  .get(
    columnCtrl.getColumnsByEntity
  );

router.route('/columns')
  .get(
    columnCtrl.getColumns
  );

export default router;
