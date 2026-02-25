"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name must contain only alphabets and spaces"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain uppercase letter")
        .regex(/[a-z]/, "Password must contain lowercase letter")
        .regex(/[0-9]/, "Password must contain number")
        .regex(/[^A-Za-z0-9]/, "Password must contain special character"),
    role: zod_1.z
        .enum(["author", "reader"])
        .refine((val) => val === "author" || val === "reader", {
        message: "Role must be either author or reader",
    }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
