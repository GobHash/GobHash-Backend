import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../../config/param-validation';
import postCtrl from '../controllers/post.controller';
import config from '../../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /v1/post - Get list of posts */
  .get(
    expressJwt({ secret: config.jwtSecret }),
    postCtrl.list
  )
  /** POST /v1/post - Create new post */
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.createPost),
    postCtrl.create
  )
  .delete(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.deletePost),
    postCtrl.remove
  );

router.route('/:postId')
  /** GET v1/post/:postId */
  .get(
    expressJwt({ secret: config.jwtSecret }),
    postCtrl.get
  );

router.route('/comment')
  /** POST v1/post/ */
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.addComment),
    postCtrl.addComment
  )
  .delete(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.deleteComment),
    postCtrl.deleteComment
  );
router.route('/like')
  /** POST v1/like */
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.addLike),
    postCtrl.addLike
  )
  .delete(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.addLike),
    postCtrl.deleteLike
  );

export default router;
