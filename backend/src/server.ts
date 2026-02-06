/**
 * Server entry point
 * Handles graceful shutdown and startup
 */

import app from './app';
import { logger } from './config/logger';
import env from './config/env';
import prisma from './infra/db/prismaClient';

const PORT = env.PORT;

const server = app.listen(PORT, async () => {
  logger.info(`🚀 CodeAtlas API server started`, {
    port: PORT,
    environment: env.NODE_ENV,
    apiVersion: env.API_VERSION,
  });

  // Test database connection
  try {
    await prisma.$connect();
    logger.info('✅ Database connection established');
  } catch (error) {
    logger.error('❌ Database connection failed', { error });
    process.exit(1);
  }
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      await prisma.$disconnect();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', { error });
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error });
  process.exit(1);
});
