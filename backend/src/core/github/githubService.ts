/**
 * GitHub Service
 * Handles GitHub API integration, webhooks, and PR comments
 */

import { logger } from '../../config/logger';
import env from '../../config/env';
import { Repository, PullRequest, GitHubWebhookPayload } from '../../types';
import { prisma } from '../../infra/db/prismaClient';

export class GitHubService {
  private readonly apiBaseUrl = env.GITHUB_API_BASE_URL;
  private readonly webhookSecret = env.GITHUB_WEBHOOK_SECRET;

  /**
   * Verify GitHub webhook signature
   */
  verifyWebhookSignature(signature: string | undefined, payload: string): boolean {
    if (!signature || !this.webhookSecret) {
      return false;
    }

    // Implementation would use crypto to verify signature
    // For now, return true in development
    return env.NODE_ENV === 'development' || this.verifySignature(signature, payload, this.webhookSecret);
  }

  private verifySignature(signature: string, payload: string, secret: string): boolean {
    // Implementation would use crypto.createHmac
    // This is a placeholder for the actual verification logic
    return true;
  }

  /**
   * Find or create repository in database
   */
  async findOrCreateRepository(
    owner: string,
    name: string,
    githubId: number,
    defaultBranch: string
  ): Promise<Repository> {
    try {
      // For demo purposes, we'll use a default tenant
      // In production, this would be extracted from webhook or auth context
      const tenantId = 'demo-tenant-id';

      let repository = await prisma.repository.findUnique({
        where: { githubId },
      });

      if (!repository) {
        repository = await prisma.repository.create({
          data: {
            tenantId,
            githubId,
            name,
            owner,
            defaultBranch,
            isPrivate: false, // Would be determined from GitHub API
          },
        });

        logger.info('Repository created', { repositoryId: repository.id, name });
      }

      return repository as Repository;
    } catch (error) {
      logger.error('Failed to find or create repository', { error });
      throw error;
    }
  }

  /**
   * Find or create pull request in database
   */
  async findOrCreatePullRequest(
    repositoryId: string,
    number: number,
    githubNodeId: string,
    title: string,
    author: string,
    state: string,
    baseBranch: string,
    headBranch: string,
    headSha: string
  ): Promise<PullRequest> {
    try {
      let pullRequest = await prisma.pullRequest.findUnique({
        where: { githubNodeId },
      });

      if (!pullRequest) {
        pullRequest = await prisma.pullRequest.create({
          data: {
            repositoryId,
            number,
            githubNodeId,
            title,
            author,
            state: state as 'open' | 'closed' | 'merged',
            baseBranch,
            headBranch,
            headSha,
          },
        });

        logger.info('Pull request created', { prId: pullRequest.id, number });
      } else {
        // Update existing PR
        pullRequest = await prisma.pullRequest.update({
          where: { id: pullRequest.id },
          data: {
            title,
            author,
            state: state as 'open' | 'closed' | 'merged',
            baseBranch,
            headBranch,
            headSha,
            updatedAt: new Date(),
          },
        });
      }

      return pullRequest as PullRequest;
    } catch (error) {
      logger.error('Failed to find or create pull request', { error });
      throw error;
    }
  }

  /**
   * Post review comment to GitHub PR
   */
  async postReviewComment(
    repositoryOwner: string,
    repositoryName: string,
    prNumber: number,
    comment: string
  ): Promise<void> {
    try {
      // Mock implementation - in production would use GitHub API
      logger.info('Posting review comment to GitHub', {
        repository: `${repositoryOwner}/${repositoryName}`,
        prNumber,
        commentLength: comment.length,
      });

      // Would make actual API call to GitHub here
      // const response = await axios.post(
      //   `${this.apiBaseUrl}/repos/${repositoryOwner}/${repositoryName}/issues/${prNumber}/comments`,
      //   { body: comment },
      //   { headers: { Authorization: `token ${githubToken}` } }
      // );

      logger.info('Review comment posted successfully');
    } catch (error) {
      logger.error('Failed to post review comment', { error });
      throw error;
    }
  }

  /**
   * Get PR diff from GitHub API
   */
  async getPullRequestDiff(
    repositoryOwner: string,
    repositoryName: string,
    prNumber: number
  ): Promise<string> {
    try {
      // Mock implementation - in production would fetch from GitHub API
      logger.info('Fetching PR diff from GitHub', {
        repository: `${repositoryOwner}/${repositoryName}`,
        prNumber,
      });

      // Would make actual API call to GitHub here
      // const response = await axios.get(
      //   `${this.apiBaseUrl}/repos/${repositoryOwner}/${repositoryName}/pulls/${prNumber}`,
      //   { headers: { Accept: 'application/vnd.github.v3.diff' } }
      // );

      // Return mock diff for demo
      return this.generateMockDiff();
    } catch (error) {
      logger.error('Failed to fetch PR diff', { error });
      throw error;
    }
  }

  /**
   * Process webhook payload and trigger review
   */
  async processWebhook(payload: GitHubWebhookPayload): Promise<void> {
    try {
      const { action, repository, pull_request } = payload;

      // Only process relevant actions
      if (action !== 'opened' && action !== 'synchronize') {
        logger.info('Ignoring webhook action', { action });
        return;
      }

      // Find or create repository
      const repo = await this.findOrCreateRepository(
        repository.owner.login,
        repository.name,
        repository.id,
        repository.default_branch
      );

      // Find or create pull request
      const pr = await this.findOrCreatePullRequest(
        repo.id,
        pull_request.number,
        pull_request.node_id,
        pull_request.title,
        pull_request.user.login,
        pull_request.state,
        pull_request.base.ref,
        pull_request.head.ref,
        pull_request.head.sha
      );

      logger.info('Webhook processed successfully', {
        repository: repo.name,
        prNumber: pr.number,
        action,
      });

    } catch (error) {
      logger.error('Failed to process webhook', { error });
      throw error;
    }
  }

  private generateMockDiff(): string {
    return `diff --git a/src/components/App.tsx b/src/components/App.tsx
index abc123..def456 100644
--- a/src/components/App.tsx
+++ b/src/components/App.tsx
@@ -1,5 +1,10 @@
 import React from 'react';
 
+// New component added
+const NewFeature = () => {
+  return <div>New feature implementation</div>;
+};
+
 function App() {
   return (
     <div className="App">
@@ -10,6 +15,7 @@ function App() {
       Edit <code>src/App.tsx</code> and save to reload.
     </div>
   );
+  // Added comment for demonstration
 }
 
 export default App;`;
  }
}

// Singleton instance
export const githubService = new GitHubService();