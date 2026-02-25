
import { redis } from '../config/redis';
import { prisma } from '../config/database';
import { ReadLogModel } from '../models/readLog.model';

const RATE_LIMIT_WINDOW = 60; // seconds

export const ReadTrackingService = {
  async trackRead(articleId: string, readerId: string | null, ip: string): Promise<boolean> {
    const key = readerId 
      ? `read:${readerId}:${articleId}`
      : `read:${ip}:${articleId}`;

    // Check rate limit (sliding window)
    const exists = await redis.get(key);
    if (exists) {
      return false; // Skip duplicate read
    }

    // Set window
    await redis.setex(key, RATE_LIMIT_WINDOW, '1');

    // Fire-and-forget: Create read log
    this.createReadLog(articleId, readerId).catch(err => {
      console.error('Failed to create read log:', err);
    });

    return true;
  },

  async createReadLog(articleId: string, readerId: string | null) {
    await ReadLogModel.create({
      articleId,
      readerId,
      readAt: new Date()
    });
  }
};