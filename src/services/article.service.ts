
import { ArticleModel } from '../models/article.model';
import { ReadTrackingService } from './readTracking.service';
import type { CreateArticleDTO, UpdateArticleDTO, ArticleQueryDTO } from '../validators/article.validator';

export const ArticleService = {
  async createArticle(data: CreateArticleDTO, authorId: string) {
    return ArticleModel.create({ ...data, authorId });
  },

  async getPublishedArticles(query: ArticleQueryDTO) {
    return ArticleModel.findPublished({
      category: query.category,
      author: query.author,
      q: query.q,
      page: query.page,
      limit: query.limit
    });
  },

  async getArticleById(id: string, readerId: string | null, ip: string) {
    const article = await ArticleModel.findById(id);
    
    if (!article || article.deletedAt || article.status !== 'PUBLISHED') {
      throw new Error('News article no longer available');
    }

    // Non-blocking read tracking
    ReadTrackingService.trackRead(id, readerId, ip).catch(console.error);

    return article;
  },

  async getAuthorArticles(authorId: string, query: ArticleQueryDTO) {
    return ArticleModel.findByAuthor(authorId, {
      includeDeleted: query.includeDeleted,
      page: query.page,
      limit: query.limit
    });
  },

  async updateArticle(id: string, authorId: string, data: UpdateArticleDTO) {
    return ArticleModel.update(id, authorId, data);
  },

  async deleteArticle(id: string, authorId: string) {
    return ArticleModel.softDelete(id, authorId);
  }
};