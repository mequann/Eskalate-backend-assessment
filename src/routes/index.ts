
import { Router } from 'express';
import authRoutes from './auth.routes';
import articleRoutes from './article.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);
router.use('/', dashboardRoutes);

export default router;