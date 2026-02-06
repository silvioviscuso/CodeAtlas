/**
 * Prisma Client singleton
 * Ensures we only create one instance per process
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../../config/logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

// Log connection events
prisma.$on('query' as never, (e: any) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Prisma Query', { query: e.query, duration: `${e.duration}ms` });
  }
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  logger.info('Prisma client disconnected');
});

export default prisma;
