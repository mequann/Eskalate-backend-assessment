
import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/author/dashboard', authenticate, authorize(['author']), DashboardController.getDashboard);

export default router;