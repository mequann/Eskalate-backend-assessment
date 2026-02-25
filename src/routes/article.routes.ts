
import { Router } from 'express';
import { ArticleController } from '../controllers/article.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createArticleSchema, updateArticleSchema } from '../validators/article.validator';

const router = Router();

// Public routes
router.get('/', authenticate, ArticleController.getFeed);
router.get('/:id', authenticate, ArticleController.getById);

// Author only routes
router.post('/', authenticate, authorize(['author']), validate(createArticleSchema), ArticleController.create);
router.get('/me', authenticate, authorize(['author']), ArticleController.getMyArticles);
router.put('/:id', authenticate, authorize(['author']), validate(updateArticleSchema), ArticleController.update);
router.delete('/:id', authenticate, authorize(['author']), ArticleController.remove);

export default router;