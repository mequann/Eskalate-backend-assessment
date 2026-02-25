"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadTrackingService = void 0;
const redis_1 = require("../config/redis");
const readLog_model_1 = require("../models/readLog.model");
const RATE_LIMIT_WINDOW = 60; // seconds
exports.ReadTrackingService = {
    async trackRead(articleId, readerId, ip) {
        const key = readerId
            ? `read:${readerId}:${articleId}`
            : `read:${ip}:${articleId}`;
        // Check rate limit (sliding window)
        const exists = await redis_1.redis.get(key);
        if (exists) {
            return false; // Skip duplicate read
        }
        // Set window
        await redis_1.redis.setex(key, RATE_LIMIT_WINDOW, '1');
        // Fire-and-forget: Create read log
        this.createReadLog(articleId, readerId).catch(err => {
            console.error('Failed to create read log:', err);
        });
        return true;
    },
    async createReadLog(articleId, readerId) {
        await readLog_model_1.ReadLogModel.create({
            articleId,
            readerId,
            readAt: new Date()
        });
    }
};
