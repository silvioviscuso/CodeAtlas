/**
 * Health check endpoint
 * Used by monitoring and load balancers
 */

import { Router, Request, Response } from 'express';
import prisma from '../../infra/db/prismaClient';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'codeatlas-api',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'codeatlas-api',
      error: 'Database connection failed',
    });
  }
});

export default router;
