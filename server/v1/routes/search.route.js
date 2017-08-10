import express from 'express';
import expressJwt from 'express-jwt';
import searchCtrl from '../controllers/search.controller';
import config from '../../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

export default router;

router.route('/')
  /** GET /v1/search - Get list of posts */
  .get(
    expressJwt({ secret: config.jwtSecret }),
    searchCtrl.searchUser
  );
