
import { prisma } from '../config/database';

export const AnalyticsModel = {
  async upsertDaily(articleId: string, date: Date, viewCount: number) {
    return prisma.dailyAnalytics.upsert({
      where: {
        articleId_date: { articleId, date }
      },
      update: { viewCount },
      create: { articleId, date, viewCount }
    });
  },

  async getAuthorStats(authorId: string) {
    const articles = await prisma.article.findMany({
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