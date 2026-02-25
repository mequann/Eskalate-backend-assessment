import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only alphabets and spaces"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[a-z]/, "Password must contain lowercase letter")
    .regex(/[0-9]/, "Password must contain number")
    .regex(/[^A-Za-z0-9]/, "Password must contain special character"),
  role: z
    .enum(["author", "reader"])
    .refine((val) => val === "author" || val === "reader", {
      message: "Role must be either author or reader",
    }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
