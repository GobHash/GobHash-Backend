import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import postRoutes from './post.route';
import searchRoutes from './search.route';
import statsRoutes from './stats.route';

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

export default router;
