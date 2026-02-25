
import { prisma } from '../config/database';

export const ReadLogModel = {
  async create(data: {
    articleId: string;
    readerId: string | null;
    readAt: Date;
  }) {
    return prisma.readLog.create({ data });
  },

  async aggregateByDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    return prisma.readLog.groupBy({
      by: ['articleId'],
      where: {
        readAt: { gte: startOfDay, lte: endOfDay }
      },
      _count: { articleId: true }
    });
  }
};