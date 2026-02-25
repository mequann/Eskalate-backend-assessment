
import { AnalyticsModel } from '../models/analytics.model';
import { ReadLogModel } from '../models/readLog.model';

export const AnalyticsService = {
  async getAuthorDashboard(authorId: string) {
    return AnalyticsModel.getAuthorStats(authorId);
  },

  async processDailyAggregation(date: Date) {
    const reads = await ReadLogModel.aggregateByDate(date);
    
    const operations = reads.map(read => 
      AnalyticsModel.upsertDaily(
        read.articleId,
        new Date(date.setUTCHours(0, 0, 0, 0)),
        read._count.articleId
      )
    );

    if (operations.length > 0) {
      await Promise.all(operations);
    }

    return { processed: operations.length, date };
  }
};