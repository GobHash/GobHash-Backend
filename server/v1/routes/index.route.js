import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import postRoutes from './post.route';
import searchRoutes from './search.route';
import statsRoutes from './stats.route';
import entityRoutes from './entity.route';
import columnRoutes from './column.route';
import operationRoutes from './operation.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount post routes at /post
router.use('/post', postRoutes);

// mount search routes at /search
router.use('/search', searchRoutes);

// mount statistics routes at /stats
router.use('/stats', statsRoutes);
// mount entity routes at /entity
router.use('/entity', entityRoutes);

// mount columns routes at /column
router.use('/column', columnRoutes);

// mount operations routes at /operations
router.use('/operations', operationRoutes);


export default router;
