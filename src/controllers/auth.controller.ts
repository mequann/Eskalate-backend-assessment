
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';

export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const user = await AuthService.signup(req.body);
      return res.status(201).json(successResponse(user, 'User created successfully'));
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json(errorResponse('Registration failed', [error.message]));
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      return res.json(successResponse({ token: result.token }, 'Login successful'));
    } catch (error: any) {
      return res.status(401).json(errorResponse('Invalid credentials', [error.message]));
    }
  }
};