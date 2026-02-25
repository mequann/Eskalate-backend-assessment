"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_controller_1 = require("../controllers/article.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const article_validator_1 = require("../validators/article.validator");
const router = (0, express_1.Router)();
// Public routes
router.get('/', auth_middleware_1.authenticate, article_controller_1.ArticleController.getFeed);
router.get('/:id', auth_middleware_1.authenticate, article_controller_1.ArticleController.getById);
// Author only routes
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['author']), (0, validation_middleware_1.validate)(article_validator_1.createArticleSchema), article_controller_1.ArticleController.create);
router.get('/me', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['author']), article_controller_1.ArticleController.getMyArticles);
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['author']), (0, validation_middleware_1.validate)(article_validator_1.updateArticleSchema), article_controller_1.ArticleController.update);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['author']), article_controller_1.ArticleController.remove);
exports.default = router;
