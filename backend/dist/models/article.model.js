"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleModel = void 0;
const database_1 = require("../config/database");
exports.ArticleModel = {
    async create(data) {
        return database_1.prisma.article.create({
            data: {
                title: data.title,
                content: data.content,
                category: data.category,
                status: data.status || "DRAFT",
                authorId: data.authorId,
            },
            include: {
                author: { select: { id: true, name: true } },
            },
        });
    },
    async findById(id, includeDeleted = false) {
        return database_1.prisma.article.findFirst({
            where: {
                id,
                ...(includeDeleted ? {} : { deletedAt: null }),
            },
            include: {
                author: { select: { id: true, name: true } },
            },
        });
    },
    async findPublished(filters) {
        const where = {
            status: "PUBLISHED",
            deletedAt: null,
        };
        if (filters.category)
            where.category = filters.category;
        if (filters.author) {
            where.author = {
                name: { contains: filters.author, mode: "insensitive" },
            };
        }
        if (filters.q) {
            where.title = { contains: filters.q, mode: "insensitive" };
        }
        // Ensure skip and take are always integers and never undefined
        const page = typeof filters.page === "number" && filters.page > 0 ? filters.page : 1;
        let take = 10;
        if (typeof filters.limit === "number" && filters.limit > 0) {
            take = filters.limit;
        }
        const [articles, total] = await Promise.all([
            database_1.prisma.article.findMany({
                where,
                skip: (page - 1) * take,
                take,
                include: { author: { select: { id: true, name: true } } },
                orderBy: { createdAt: "desc" },
            }),
            database_1.prisma.article.count({ where }),
        ]);
        return { articles, total };
    },
    async findByAuthor(authorId, filters) {
        const where = { authorId };
        if (!filters.includeDeleted)
            where.deletedAt = null;
        // Ensure skip and take are always integers
        const page = typeof filters.page === "number" && filters.page > 0 ? filters.page : 1;
        const limit = typeof filters.limit === "number" && filters.limit > 0
            ? filters.limit
            : 10;
        const [articles, total] = await Promise.all([
            database_1.prisma.article.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            database_1.prisma.article.count({ where }),
        ]);
        return { articles, total };
    },
    async update(id, authorId, data) {
        const article = await database_1.prisma.article.findFirst({
            where: { id, authorId, deletedAt: null },
        });
        if (!article) {
            const error = new Error("Article not found or forbidden");
            error.statusCode = 403;
            throw error;
        }
        return database_1.prisma.article.update({
            where: { id },
            data,
            include: { author: { select: { id: true, name: true } } },
        });
    },
    async softDelete(id, authorId) {
        const article = await database_1.prisma.article.findFirst({
            where: { id, authorId, deletedAt: null },
        });
        if (!article) {
            const error = new Error("Article not found or forbidden");
            error.statusCode = 403;
            throw error;
        }
        return database_1.prisma.article.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    },
};
