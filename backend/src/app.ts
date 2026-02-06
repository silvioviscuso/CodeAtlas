/**
 * Express application setup
 * Production-ready middleware stack with security, CORS, rate limiting
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger, requestLogger } from './config/logger';
import { sentryRequestHandler, sentryTracingHandler, sentryErrorHandler } from './config/sentry';
import env from './config/env';

// Import routes
import healthRoutes from './api/routes/health';
import authRoutes from './api/routes/auth';
import tenantRoutes from './api/routes/tenants';
import reviewRoutes from './api/routes/reviews';
import githubRoutes from './api/routes/github';

// Import middleware
import { errorHandler } from './api/middleware/errorHandler';
import { requestContext } from './api/middleware/requestContext';

const createApp = (): Express => {
  const app = express();

  // Security middleware (must be first)
  app.use(helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
  }));

  // CORS configuration
  app.use(cors({
    origin: env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGINS?.split(',') || []
      : true, // Allow all origins in development
    credentials: true,
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Sentry request handler (must be first)
  app.use(sentryRequestHandler);
  
  // Sentry tracing handler
  app.use(sentryTracingHandler);

  // Request logging
  app.use(requestLogger);

  // Request context (for tenant/user extraction)
  app.use(requestContext);

  // Rate limiting
  const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  // Health check (no rate limit)
  app.use('/health', healthRoutes);

  // API routes
  const apiPrefix = `/api/${env.API_VERSION}`;
  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/tenants`, tenantRoutes);
  app.use(`${apiPrefix}/reviews`, reviewRoutes);
  app.use(`${apiPrefix}/github`, githubRoutes);

  // Root endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'CodeAtlas API',
      version: env.API_VERSION,
      status: 'operational',
      documentation: 'https://github.com/codeatlas/codeatlas',
    });
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested resource was not found.',
    });
  });

  // Error handler (must be last)
  app.use(sentryErrorHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
