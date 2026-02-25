
import { prisma } from '../config/database';
import type { CreateArticleDTO, UpdateArticleDTO } from '../validators/article.validator';

export const ArticleModel = {
  async create(data: CreateArticleDTO & { authorId: string }) {
    return prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        status: data.status || 'DRAFT',
        authorId: data.authorId
      },
      include: {
        author: { select: { id: true, name: true } }
      }
    });
  },

  async findById(id: string, includeDeleted = false) {
    return prisma.article.findFirst({
      where: {
        id,
        ...(includeDeleted ? {} : { deletedAt: null })
      },
      include: {
        author: { select: { id: true, name: true } }
      }
    });
  },

  async findPublished(filters: {
    category?: string;
    author?: string;
    q?: string;
    page: number;
    limit: number;
  }) {
    const where: any = {
      status: 'PUBLISHED',
      deletedAt: null
    };

    if (filters.category) where.category = filters.category;
    if (filters.author) {
      where.author = { name: { contains: filters.author, mode: 'insensitive' } };
    }
    if (filters.q) {
      where.title = { contains: filters.q, mode: 'insensitive' };
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.article.count({ where })
    ]);

    return { articles, total };
  },

  async findByAuthor(authorId: string, filters: {
    includeDeleted?: boolean;
    page: number;
    limit: number;
  }) {
    const where: any = { authorId };
    if (!filters.includeDeleted) where.deletedAt = null;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.article.count({ where })
    ]);

    return { articles, total };
  },

  async update(id: string, authorId: string, data: UpdateArticleDTO) {
    const article = await prisma.article.findFirst({
      where: { id, authorId, deletedAt: null }
    });

    if (!article) {
      const error = new Error('Article not found or forbidden');
      (error as any).statusCode = 403;
      throw error;
    }

    return prisma.article.update({
      where: { id },
      data,
      include: { author: { select: { id: true, name: true } } }
    });
  },

  async softDelete(id: string, authorId: string) {
    const article = await prisma.article.findFirst({
      where: { id, authorId, deletedAt: null }
    });

    if (!article) {
      const error = new Error('Article not found or forbidden');
      (error as any).statusCode = 403;
      throw error;
    }

    return prisma.article.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
};