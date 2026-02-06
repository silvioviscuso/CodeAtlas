/**
 * Request context middleware
 * Extracts tenant and user from JWT token and attaches to request
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../../config/env';

export interface RequestContext {
  userId?: string;
  tenantId?: string;
  userEmail?: string;
  githubUserId?: string;
}

declare global {
  namespace Express {
    interface Request {
      context?: RequestContext;
    }
  }
}

export const requestContext = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const context: RequestContext = {};

  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        userId: string;
        tenantId: string;
        email: string;
        githubUserId?: string;
      };

      context.userId = decoded.userId;
      context.tenantId = decoded.tenantId;
      context.userEmail = decoded.email;
      context.githubUserId = decoded.githubUserId;
    } catch (error) {
      // Invalid token - continue without auth context
      // Individual routes can enforce auth if needed
    }
  }

  req.context = context;
  next();
};
