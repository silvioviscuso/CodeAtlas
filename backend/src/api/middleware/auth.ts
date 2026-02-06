/**
 * Authentication middleware
 * Ensures request has valid authenticated user
 */

import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.context?.userId || !req.context?.tenantId) {
    throw createError('Authentication required', 401, 'UNAUTHORIZED');
  }
  next();
};

// Optional: require specific role
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    requireAuth(req, _res, () => {
      // Role check would go here if we add role to context
      // For now, just ensure auth is present
      next();
    });
  };
};
