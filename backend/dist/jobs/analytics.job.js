"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsQueue = exports.scheduleAnalyticsJob = exports.analyticsWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const analytics_service_1 = require("../services/analytics.service");
const node_cron_1 = __importDefault(require("node-cron"));
const analyticsQueue = new bullmq_1.Queue("analytics", { connection: redis_1.redis });
exports.analyticsQueue = analyticsQueue;
exports.analyticsWorker = new bullmq_1.Worker("analytics", async (job) => {
    if (job.name === "aggregate-daily") {
        const { date } = job.data;
        const result = await analytics_service_1.AnalyticsService.processDailyAggregation(new Date(date));
        console.log(`[Analytics] Processed ${result.processed} articles for ${result.date.toDateString()}`);
        return result;
    }
}, { connection: redis_1.redis });
const scheduleAnalyticsJob = () => {
    // Run at 00:00 GMT daily
    node_cron_1.default.schedule("0 0 * * *", async () => {
        const yesterday = new Date();
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        await analyticsQueue.add("aggregate-daily", {
            date: yesterday.toISOString(),
        });
        console.log("[Scheduler] Queued daily analytics job for", yesterday.toDateString());
    });
    console.log("[Scheduler] Analytics job scheduler started");
};
exports.scheduleAnalyticsJob = scheduleAnalyticsJob;
