"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
const article_service_1 = require("../services/article.service");
const response_1 = require("../utils/response");
exports.ArticleController = {
    async create(req, res) {
        try {
            const article = await article_service_1.ArticleService.createArticle(req.body, req.user.id);
            return res
                .status(201)
                .json((0, response_1.successResponse)(article, "Article created successfully"));
        }
        catch (error) {
            return res
                .status(400)
                .json((0, response_1.errorResponse)("Creation failed", [error.message]));
        }
    },
    async getFeed(req, res) {
        try {
            // Always ensure limit is a valid integer, never undefined
            const page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = 10;
            if (req.query.limit && !isNaN(parseInt(req.query.limit))) {
                limit = parseInt(req.query.limit);
            }
            else if (req.query.pageSize &&
                !isNaN(parseInt(req.query.pageSize))) {
                limit = parseInt(req.query.pageSize);
            }
            const result = await article_service_1.ArticleService.getPublishedArticles({
                ...req.query,
                page,
                limit,
                includeDeleted: false,
            });
            return res.json((0, response_1.paginatedResponse)(result.articles, page, limit, result.total, "Articles retrieved successfully"));
        }
        catch (error) {
            return res
                .status(500)
                .json((0, response_1.errorResponse)("Failed to fetch articles", [error.message]));
        }
    },
    async getById(req, res) {
        try {
            const id = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;
            const article = await article_service_1.ArticleService.getArticleById(id, req.user?.id || "", req.ip || "");
            return res.json((0, response_1.successResponse)(article, "Article retrieved successfully"));
        }
        catch (error) {
            return res
                .status(404)
                .json((0, response_1.errorResponse)("News article no longer available", [error.message]));
        }
    },
    async getMyArticles(req, res) {
        try {
            const result = await article_service_1.ArticleService.getAuthorArticles(req.user.id, req.query);
            const articles = result.articles.map((article) => ({
                ...article,
                isDeleted: article.deletedAt !== null,
            }));
            return res.json((0, response_1.paginatedResponse)(articles, parseInt(req.query.page) || 1, parseInt(req.query.limit) || 10, result.total, "My articles retrieved successfully"));
        }
        catch (error) {
            return res
                .status(500)
                .json((0, response_1.errorResponse)("Failed to fetch articles", [error.message]));
        }
    },
    async update(req, res) {
        try {
            const id = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;
            const article = await article_service_1.ArticleService.updateArticle(id, req.user.id, req.body);
            return res.json((0, response_1.successResponse)(article, "Article updated successfully"));
        }
        catch (error) {
            const status = error.statusCode || 400;
            return res
                .status(status)
                .json((0, response_1.errorResponse)("Update failed", [error.message]));
        }
    },
    async remove(req, res) {
        try {
            const id = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;
            await article_service_1.ArticleService.deleteArticle(id, req.user.id);
            return res.json((0, response_1.successResponse)(null, "Article deleted successfully"));
        }
        catch (error) {
            const status = error.statusCode || 400;
            return res
                .status(status)
                .json((0, response_1.errorResponse)("Deletion failed", [error.message]));
        }
    },
};
