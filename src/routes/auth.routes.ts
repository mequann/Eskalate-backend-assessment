// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { signupSchema, loginSchema } from '../validators/user.validator';

const router = Router();

router.post('/signup', validate(signupSchema), AuthController.signup);
router.post('/login', validate(loginSchema), AuthController.login);

export default router;