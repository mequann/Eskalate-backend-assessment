import { Queue, Worker } from "bullmq";
import { redis } from "../config/redis";
import { AnalyticsService } from "../services/analytics.service";
import cron from "node-cron";

const analyticsQueue = new Queue("analytics", { connection: redis });

import type { Job } from "bullmq";

export const analyticsWorker = new Worker(
  "analytics",
  async (job: Job) => {
    if (job.name === "aggregate-daily") {
      const { date } = job.data;
      const result = await AnalyticsService.processDailyAggregation(
        new Date(date),
      );
      console.log(
        `[Analytics] Processed ${result.processed} articles for ${result.date.toDateString()}`,
      );
      return result;
    }
  },
  { connection: redis },
);

export const scheduleAnalyticsJob = () => {
  // Run at 00:00 GMT daily
  cron.schedule("0 0 * * *", async () => {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    await analyticsQueue.add("aggregate-daily", {
      date: yesterday.toISOString(),
    });

    console.log(
      "[Scheduler] Queued daily analytics job for",
      yesterday.toDateString(),
    );
  });

  console.log("[Scheduler] Analytics job scheduler started");
};

export { analyticsQueue };
