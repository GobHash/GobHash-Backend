import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../../config/param-validation';
import postCtrl from '../controllers/post.controller';
import config from '../../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /v1/post - Get list of posts */
  /** POST /v1/post - Create new post */
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.createPost),
    postCtrl.create
  );

export default router;
