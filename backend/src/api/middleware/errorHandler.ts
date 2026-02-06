/**
 * Global error handler middleware
 * Provides consistent error responses and logging
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logger';
import { ZodError } from 'zod';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export const errorHandler = (
  err: ApiError | ZodError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error
  logger.error('API Error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Handle custom API errors
  const apiError = err as ApiError;
  const statusCode = apiError.statusCode || 500;
  const message = apiError.message || 'Internal Server Error';

  // Don't expose internal error details in production
  const response: Record<string, unknown> = {
    error: statusCode >= 500 ? 'Internal Server Error' : message,
    message,
  };

  if (apiError.details && process.env.NODE_ENV !== 'production') {
    response.details = apiError.details;
  }

  res.status(statusCode).json(response);
};

// Helper to create API errors
export const createError = (
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: unknown
): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};
