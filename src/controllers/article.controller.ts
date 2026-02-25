import { Response } from "express";
import { ArticleService } from "../services/article.service";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/response";
import type { AuthRequest } from "../middlewares/auth.middleware";

export const ArticleController = {
  async create(req: AuthRequest, res: Response) {
    try {
      const article = await ArticleService.createArticle(
        req.body,
        req.user!.id,
      );
      return res
        .status(201)
        .json(successResponse(article, "Article created successfully"));
    } catch (error: any) {
      return res
        .status(400)
        .json(errorResponse("Creation failed", [error.message]));
    }
  },

  async getFeed(req: AuthRequest, res: Response) {
    try {
      const result = await ArticleService.getPublishedArticles(
        req.query as any,
      );
      return res.json(
        paginatedResponse(
          result.articles,
          parseInt(req.query.page as string) || 1,
          parseInt(req.query.limit as string) || 10,
          result.total,
          "Articles retrieved successfully",
        ),
      );
    } catch (error: any) {
      return res
        .status(500)
        .json(errorResponse("Failed to fetch articles", [error.message]));
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const article = await ArticleService.getArticleById(
        id,
        req.user?.id || "",
        req.ip || "",
      );
      return res.json(
        successResponse(article, "Article retrieved successfully"),
      );
    } catch (error: any) {
      return res
        .status(404)
        .json(
          errorResponse("News article no longer available", [error.message]),
        );
    }
  },

  async getMyArticles(req: AuthRequest, res: Response) {
    try {
      const result = await ArticleService.getAuthorArticles(
        req.user!.id,
        req.query as any,
      );

      const articles = result.articles.map((article: any) => ({
        ...article,
        isDeleted: article.deletedAt !== null,
      }));

      return res.json(
        paginatedResponse(
          articles,
          parseInt(req.query.page as string) || 1,
          parseInt(req.query.limit as string) || 10,
          result.total,
          "My articles retrieved successfully",
        ),
      );
    } catch (error: any) {
      return res
        .status(500)
        .json(errorResponse("Failed to fetch articles", [error.message]));
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const article = await ArticleService.updateArticle(
        id,
        req.user!.id,
        req.body,
      );
      return res.json(successResponse(article, "Article updated successfully"));
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res
        .status(status)
        .json(errorResponse("Update failed", [error.message]));
    }
  },

  async remove(req: AuthRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      await ArticleService.deleteArticle(id, req.user!.id);
      return res.json(successResponse(null, "Article deleted successfully"));
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res
        .status(status)
        .json(errorResponse("Deletion failed", [error.message]));
    }
  },
};
