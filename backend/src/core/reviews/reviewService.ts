/**
 * Review service
 * Manages AI review jobs and results
 */

import prisma from '../../infra/db/prismaClient';
import { createError } from '../../api/middleware/errorHandler';
import { aiEngine } from '../../ai/engine';
import { logger } from '../../config/logger';

interface ListReviewsParams {
  repositoryId?: string;
  pullRequestId?: string;
  category?: string;
  severity?: string;
  limit: number;
  offset: number;
}

class ReviewService {
  /**
   * List reviews for tenant with filters
   */
  async listReviews(tenantId: string, params: ListReviewsParams) {
    const where: any = {
      tenantId,
      ...(params.repositoryId && {
        pullRequest: { repositoryId: params.repositoryId },
      }),
      ...(params.pullRequestId && { pullRequestId: params.pullRequestId }),
      ...(params.category && {
        findings: { some: { category: params.category } },
      }),
      ...(params.severity && {
        findings: { some: { severity: params.severity } },
      }),
    };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          pullRequest: {
            include: {
              repository: {
                select: {
                  id: true,
                  name: true,
                  fullName: true,
                },
              },
            },
          },
          findings: {
            orderBy: [
              { severity: 'desc' },
              { category: 'asc' },
            ],
          },
        },
        orderBy: { createdAt: 'desc' },
        take: params.limit,
        skip: params.offset,
      }),
      prisma.review.count({ where }),
    ]);

    return {
      reviews,
      pagination: {
        total,
        limit: params.limit,
        offset: params.offset,
        hasMore: params.offset + params.limit < total,
      },
    };
  }

  /**
   * Get review by ID
   */
  async getReviewById(tenantId: string, reviewId: string) {
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        tenantId,
      },
      include: {
        pullRequest: {
          include: {
            repository: {
              select: {
                id: true,
                name: true,
                fullName: true,
              },
            },
          },
        },
        findings: {
          orderBy: [
            { severity: 'desc' },
            { category: 'asc' },
          ],
        },
      },
    });

    if (!review) {
      throw createError('Review not found', 404);
    }

    return review;
  }

  /**
   * Trigger AI review for a pull request
   */
  async triggerReview(
    tenantId: string,
    pullRequestId: string,
    userId: string | null,
    priority: number = 5
  ) {
    // Verify pull request belongs to tenant
    const pullRequest = await prisma.pullRequest.findFirst({
      where: {
        id: pullRequestId,
        repository: { tenantId },
      },
      include: {
        repository: true,
      },
    });

    if (!pullRequest) {
      throw createError('Pull request not found', 404);
    }

    // Create review job
    const job = await prisma.reviewJob.create({
      data: {
        pullRequestId,
        userId,
        status: 'pending',
        priority,
      },
    });

    // Process review asynchronously (in production, use a queue)
    this.processReview(job.id, tenantId, pullRequest).catch((error) => {
      logger.error('Review processing failed', { jobId: job.id, error });
    });

    return job;
  }

  /**
   * Process review job (async)
   */
  private async processReview(
    jobId: string,
    tenantId: string,
    pullRequest: any
  ): Promise<void> {
    try {
      // Update job status
      await prisma.reviewJob.update({
        where: { id: jobId },
        data: { status: 'processing', startedAt: new Date() },
      });

      // Fetch PR diff from GitHub (simplified - would use GitHub API)
      const diffSummary = await this.fetchPullRequestDiff(
        pullRequest.repository.fullName,
        pullRequest.githubPrNumber
      );

      // Run AI review
      const aiResult = await aiEngine.reviewPullRequest({
        repository: pullRequest.repository.fullName,
        title: pullRequest.title,
        author: pullRequest.author,
        baseBranch: pullRequest.baseBranch,
        headBranch: pullRequest.headBranch,
        diffSummary,
      });

      // Create review record
      const review = await prisma.review.create({
        data: {
          tenantId,
          pullRequestId: pullRequest.id,
          reviewJobId: jobId,
          status: 'completed',
          summary: aiResult.summary,
          overallScore: aiResult.overallScore,
          metadata: aiResult.metadata,
          findings: {
            create: aiResult.findings.map((f) => ({
              category: f.category,
              severity: f.severity,
              filePath: f.filePath,
              lineStart: f.lineStart,
              lineEnd: f.lineEnd,
              title: f.title,
              description: f.description,
              suggestion: f.suggestion,
              codeSnippet: f.codeSnippet,
            })),
          },
        },
      });

      // Update job status
      await prisma.reviewJob.update({
        where: { id: jobId },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      });

      logger.info('Review completed', { jobId, reviewId: review.id });
    } catch (error: any) {
      // Mark job as failed
      await prisma.reviewJob.update({
        where: { id: jobId },
        data: {
          status: 'failed',
          errorMessage: error.message,
          completedAt: new Date(),
        },
      });

      throw error;
    }
  }

  /**
   * Fetch PR diff from GitHub (simplified stub)
   * In production, use GitHub API with proper authentication
   */
  private async fetchPullRequestDiff(
    fullName: string,
    prNumber: number
  ): Promise<string> {
    // This would call GitHub API to get the diff
    // For now, return a placeholder
    return `Diff for ${fullName}#${prNumber}`;
  }
}

export const reviewService = new ReviewService();
