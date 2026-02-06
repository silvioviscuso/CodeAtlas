/**
 * Review routes
 * AI review results and management
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { reviewService } from '../../core/reviews/reviewService';
import { requireAuth } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// List reviews for current tenant
const listReviewsSchema = z.object({
  repositoryId: z.string().optional(),
  pullRequestId: z.string().optional(),
  category: z.enum(['readability', 'bug', 'security', 'performance', 'maintainability']).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default('20'),
  offset: z.string().transform(Number).pipe(z.number().int().nonnegative()).default('0'),
});

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const params = listReviewsSchema.parse(req.query);
    const reviews = await reviewService.listReviews(
      req.context!.tenantId!,
      params
    );
    res.json({ reviews });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError('Invalid query parameters', 400, 'VALIDATION_ERROR', error.errors);
    }
    throw error;
  }
});

// Get specific review
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const review = await reviewService.getReviewById(
      req.context!.tenantId!,
      req.params.id
    );
    res.json({ review });
  } catch (error) {
    throw error;
  }
});

// Trigger manual review for a PR
const triggerReviewSchema = z.object({
  pullRequestId: z.string(),
  priority: z.number().int().min(0).max(10).optional(),
});

router.post('/trigger', requireAuth, async (req: Request, res: Response) => {
  try {
    const { pullRequestId, priority } = triggerReviewSchema.parse(req.body);
    const job = await reviewService.triggerReview(
      req.context!.tenantId!,
      pullRequestId,
      req.context!.userId!,
      priority
    );
    res.json({ job });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError('Invalid request body', 400, 'VALIDATION_ERROR', error.errors);
    }
    throw error;
  }
});

export default router;
