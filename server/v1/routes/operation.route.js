import express from 'express';
import operationCtrl from '../controllers/operation.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/operations')
  .get(
    operationCtrl.getOperations
  );

router.route('/type/:id')
  .get(
    operationCtrl.getOperationsByType
  );

export default router;
