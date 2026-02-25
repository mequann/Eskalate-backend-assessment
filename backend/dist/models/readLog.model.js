"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadLogModel = void 0;
const database_1 = require("../config/database");
exports.ReadLogModel = {
    async create(data) {
        return database_1.prisma.readLog.create({ data });
    },
    async aggregateByDate(date) {
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        return database_1.prisma.readLog.groupBy({
            by: ['articleId'],
            where: {
                readAt: { gte: startOfDay, lte: endOfDay }
            },
            _count: { articleId: true }
        });
    }
};
