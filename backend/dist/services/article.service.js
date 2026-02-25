"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const article_model_1 = require("../models/article.model");
const readTracking_service_1 = require("./readTracking.service");
exports.ArticleService = {
    async createArticle(data, authorId) {
        return article_model_1.ArticleModel.create({ ...data, authorId });
    },
    async getPublishedArticles(query) {
        // Always ensure page and limit are valid numbers
        const page = typeof query.page === "number" && query.page > 0 ? query.page : 1;
        let limit = 10;
        if (typeof query.limit === "number" && query.limit > 0) {
            limit = query.limit;
        }
        else if (typeof query.pageSize === "number" &&
            query.pageSize > 0) {
            limit = query.pageSize;
        }
        return article_model_1.ArticleModel.findPublished({
            category: query.category,
            author: query.author,
            q: query.q,
            page,
            limit,
        });
    },
    async getArticleById(id, readerId, ip) {
        const article = await article_model_1.ArticleModel.findById(id);
        if (!article || article.deletedAt || article.status !== "PUBLISHED") {
            throw new Error("News article no longer available");
        }
        // Non-blocking read tracking
        readTracking_service_1.ReadTrackingService.trackRead(id, readerId, ip).catch(console.error);
        return article;
    },
    async getAuthorArticles(authorId, query) {
        return article_model_1.ArticleModel.findByAuthor(authorId, {
            includeDeleted: query.includeDeleted,
            page: query.page,
            limit: query.limit,
        });
    },
    async updateArticle(id, authorId, data) {
        return article_model_1.ArticleModel.update(id, authorId, data);
    },
    async deleteArticle(id, authorId) {
        return article_model_1.ArticleModel.softDelete(id, authorId);
    },
};
