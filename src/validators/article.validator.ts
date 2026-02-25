import { z } from "zod";

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title max 150 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

export const updateArticleSchema = createArticleSchema.partial();

export const articleQuerySchema = z.object({
  category: z.string().optional(),
  author: z.string().optional(),
  q: z.string().optional(),
  page: z.string().transform(Number).default(1),
  limit: z.string().transform(Number).default(10),
  includeDeleted: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
});

export type CreateArticleDTO = z.infer<typeof createArticleSchema>;
export type UpdateArticleDTO = z.infer<typeof updateArticleSchema>;
export type ArticleQueryDTO = z.infer<typeof articleQuerySchema>;
