"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const analytics_service_1 = require("../services/analytics.service");
const response_1 = require("../utils/response");
exports.DashboardController = {
    async getDashboard(req, res) {
        try {
            const stats = await analytics_service_1.AnalyticsService.getAuthorDashboard(req.user.id);
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedStats = stats.slice(start, end);
            return res.json((0, response_1.paginatedResponse)(paginatedStats, page, limit, stats.length, 'Dashboard data retrieved successfully'));
        }
        catch (error) {
            return res.status(500).json((0, response_1.errorResponse)('Failed to fetch dashboard', [error.message]));
        }
    }
};
