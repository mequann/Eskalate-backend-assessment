
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    Success: false,
    Message: err.message || 'Internal server error',
    Object: null,
    Errors: env.NODE_ENV === 'development' ? [err.stack] : []
  });
};