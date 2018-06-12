import express from 'express';
import entityCtrl from '../controllers/entity.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/entities')
  .get(
    entityCtrl.getEntities
  );

export default router;
