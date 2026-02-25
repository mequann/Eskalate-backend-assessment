"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModel = void 0;
const database_1 = require("../config/database");
exports.AnalyticsModel = {
    async upsertDaily(articleId, date, viewCount) {
        return database_1.prisma.dailyAnalytics.upsert({
            where: {
                articleId_date: { articleId, date }
            },
            update: { viewCount },
            create: { articleId, date, viewCount }
        });
    },
    async getAuthorStats(authorId) {
        const articles = await database_1.prisma.article.findMany({
            where: { authorId, deletedAt: null },
            include: { analytics: true }
        });
        return articles.map(article => ({
            id: article.id,
            title: article.title,
            createdAt: article.createdAt,
            status: article.status,
            totalViews: article.analytics.reduce((sum, day) => sum + day.viewCount, 0)
        }));
    }
};
