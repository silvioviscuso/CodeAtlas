/**
 * Authentication routes
 * GitHub OAuth flow and token management
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../../core/auth/authService';
import { requireAuth } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GitHub OAuth callback
const githubCallbackSchema = z.object({
  code: z.string(),
  state: z.string().optional(),
});

router.post('/github/callback', async (req: Request, res: Response) => {
  try {
    const { code } = githubCallbackSchema.parse(req.body);

    const result = await authService.handleGitHubCallback(code);

    res.json({
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        githubUsername: result.user.githubUsername,
      },
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        slug: result.tenant.slug,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError('Invalid request', 400, 'VALIDATION_ERROR', error.errors);
    }
    throw error;
  }
});

// Get current user info
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await authService.getCurrentUser(req.context!.userId!);
    res.json({ user });
  } catch (error) {
    throw error;
  }
});

// Refresh token (if implementing refresh tokens)
router.post('/refresh', requireAuth, async (req: Request, res: Response) => {
  // Implementation would go here
  res.json({ message: 'Token refresh not yet implemented' });
});

export default router;
