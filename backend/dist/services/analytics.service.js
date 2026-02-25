"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const analytics_model_1 = require("../models/analytics.model");
const readLog_model_1 = require("../models/readLog.model");
exports.AnalyticsService = {
    async getAuthorDashboard(authorId) {
        return analytics_model_1.AnalyticsModel.getAuthorStats(authorId);
    },
    async processDailyAggregation(date) {
        const reads = await readLog_model_1.ReadLogModel.aggregateByDate(date);
        const operations = reads.map(read => analytics_model_1.AnalyticsModel.upsertDaily(read.articleId, new Date(date.setUTCHours(0, 0, 0, 0)), read._count.articleId));
        if (operations.length > 0) {
            await Promise.all(operations);
        }
        return { processed: operations.length, date };
    }
};
