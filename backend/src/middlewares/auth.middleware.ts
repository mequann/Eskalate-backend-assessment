
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'author' | 'reader';
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        Success: false,
        Message: 'Unauthorized',
        Object: null,
        Errors: ['No token provided']
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({
      Success: false,
      Message: 'Unauthorized',
      Object: null,
      Errors: ['Invalid or expired token']
    });
  }
};

export const authorize = (roles: ('author' | 'reader')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        Success: false,
        Message: 'Forbidden',
        Object: null,
        Errors: ['Insufficient permissions']
      });
    }
    next();
  };
};