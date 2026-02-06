/**
 * Sentry Configuration
 * Error tracking and performance monitoring
 */

import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import env from './env';

// Initialize Sentry
Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [
    // Add profiling integration
    new ProfilingIntegration(),
  ],
  beforeSend(event) {
    // Filter out sensitive information
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers?.authorization;
      delete event.request.headers?.['x-api-key'];
    }
    
    // Filter out specific error types in development
    if (env.NODE_ENV === 'development') {
      if (event.exception?.values?.[0]?.type === 'ValidationError') {
        return null; // Don't send validation errors in development
      }
    }
    
    return event;
  },
  beforeSendTransaction(event) {
    // Filter out health check transactions
    if (event.transaction === 'GET /health') {
      return null;
    }
    return event;
  },
});

/**
 * Sentry middleware for Express
 */
export const sentryRequestHandler = Sentry.Handlers.requestHandler();
export const sentryTracingHandler = Sentry.Handlers.tracingHandler();
export const sentryErrorHandler = Sentry.Handlers.errorHandler();

/**
 * Capture exception with context
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      Object.keys(context).forEach((key) => {
        scope.setContext(key, context[key]);
      });
    }
    Sentry.captureException(error);
  });
};

/**
 * Capture message with context
 */
export const captureMessage = (message: string, level: Sentry.Severity = Sentry.Severity.Info, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    if (context) {
      Object.keys(context).forEach((key) => {
        scope.setContext(key, context[key]);
      });
    }
    Sentry.captureMessage(message);
  });
};

/**
 * Set user context
 */
export const setUser = (user: { id: string; email?: string; name?: string }) => {
  Sentry.setUser(user);
};

/**
 * Add breadcrumb
 */
export const addBreadcrumb = (message: string, category?: string, level: Sentry.Severity = Sentry.Severity.Info) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
  });
};

export default Sentry;