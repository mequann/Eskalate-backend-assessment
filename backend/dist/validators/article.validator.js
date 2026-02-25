"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleQuerySchema = exports.updateArticleSchema = exports.createArticleSchema = void 0;
const zod_1 = require("zod");
exports.createArticleSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(150, "Title max 150 characters"),
    content: zod_1.z.string().min(50, "Content must be at least 50 characters"),
    category: zod_1.z.string().min(1, "Category is required"),
    status: zod_1.z.enum(["DRAFT", "PUBLISHED"]).optional(),
});
exports.updateArticleSchema = exports.createArticleSchema.partial();
exports.articleQuerySchema = zod_1.z.object({
    category: zod_1.z.string().optional(),
    author: zod_1.z.string().optional(),
    q: zod_1.z.string().optional(),
    page: zod_1.z.string().transform(Number).default(1),
    limit: zod_1.z.string().transform(Number).default(10),
    includeDeleted: zod_1.z
        .enum(["true", "false"])
        .optional()
        .transform((v) => v === "true"),
});
