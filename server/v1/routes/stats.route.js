import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../../config/param-validation';
import statsCtrl from '../controllers/stats.controller';
import config from '../../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/user/:userId')
  /** GET /v1/stats/user/userId - Get stats of a user */
  .get(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.statsUser),
    statsCtrl.userStats
  );

export default router;
