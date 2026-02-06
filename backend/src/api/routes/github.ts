/**
 * GitHub webhook routes
 * Receives GitHub events and triggers AI reviews
 */

import { Router, Request, Response } from 'express';
import { githubService } from '../../core/github/githubService';
import { reviewService } from '../../core/reviews/reviewService';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GitHub webhook receiver
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    // Verify webhook signature (would implement in production)
    // const signature = req.headers['x-hub-signature-256'];
    // githubService.verifyWebhookSignature(signature, req.body);

    const event = req.headers['x-github-event'] as string;
    const payload = req.body;

    // Handle different GitHub events
    switch (event) {
      case 'pull_request':
        await handlePullRequestEvent(payload);
        break;
      case 'ping':
        // GitHub sends ping on webhook creation
        res.json({ message: 'Webhook configured successfully' });
        return;
      default:
        // Ignore other events for now
        res.json({ message: 'Event ignored' });
        return;
    }

    res.json({ message: 'Webhook processed' });
  } catch (error) {
    // Log but don't expose internal errors to GitHub
    console.error('GitHub webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

async function handlePullRequestEvent(payload: any): Promise<void> {
  const action = payload.action;
  const pr = payload.pull_request;
  const repo = payload.repository;

  // Only process opened and synchronize (new commits) events
  if (action === 'opened' || action === 'synchronize') {
    // Find or create repository and PR records
    const repository = await githubService.findOrCreateRepository(
      repo.owner.login,
      repo.name,
      repo.id,
      repo.default_branch
    );

    const pullRequest = await githubService.findOrCreatePullRequest(
      repository.id,
      pr.number,
      pr.node_id,
      pr.title,
      pr.user.login,
      pr.state,
      pr.base.ref,
      pr.head.ref,
      pr.head.sha
    );

    // Queue AI review job
    await reviewService.triggerReview(
      repository.tenantId,
      pullRequest.id,
      null, // Auto-triggered
      5 // Default priority
    );
  }
}

export default router;
