
import { Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response';
import type { AuthRequest } from '../middlewares/auth.middleware';

export const DashboardController = {
  async getDashboard(req: AuthRequest, res: Response) {
    try {
      const stats = await AnalyticsService.getAuthorDashboard(req.user!.id);
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedStats = stats.slice(start, end);

      return res.json(paginatedResponse(
        paginatedStats,
        page,
        limit,
        stats.length,
        'Dashboard data retrieved successfully'
      ));
    } catch (error: any) {
      return res.status(500).json(errorResponse('Failed to fetch dashboard', [error.message]));
    }
  }
};