/**
 * AI Review Engine
 * Provider-agnostic abstraction for AI-powered code reviews
 * 
 * Trade-offs:
 * - Provider-agnostic design allows easy switching between OpenAI/Anthropic
 * - Structured output ensures consistent review format across providers
 * - Validation layer ensures data integrity before processing
 * - Error handling with fallbacks for production reliability
 */

import { logger } from '../config/logger';
import env from '../config/env';
import { OpenAIProvider } from './providers/openaiProvider';
import { AnthropicProvider } from './providers/anthropicProvider';
import { prReviewPrompt } from './prompts/prReviewPrompt';
import { ReviewInput, FileChange, ReviewFinding, ReviewResult, ReviewFeedback, AIProvider } from '../types';

// Validation schema for AI output
const validateReviewResult = (result: any): ReviewResult => {
  if (!result || typeof result !== 'object') {
    throw new Error('Invalid review result format');
  }

  if (typeof result.summary !== 'string' || !result.summary.trim()) {
    throw new Error('Review summary is required');
  }

  if (typeof result.overallScore !== 'number' || result.overallScore < 0 || result.overallScore > 100) {
    throw new Error('Overall score must be a number between 0 and 100');
  }

  if (!Array.isArray(result.findings)) {
    throw new Error('Findings must be an array');
  }

  // Validate findings
  result.findings.forEach((finding: any, index: number) => {
    const requiredFields = ['category', 'severity', 'title', 'description'];
    for (const field of requiredFields) {
      if (!finding[field] || typeof finding[field] !== 'string') {
        throw new Error(`Finding ${index}: ${field} is required and must be a string`);
      }
    }

    if (finding.category && !['readability', 'security', 'performance', 'maintainability', 'bug'].includes(finding.category)) {
      throw new Error(`Finding ${index}: Invalid category`);
    }

    if (finding.severity && !['low', 'medium', 'high', 'critical'].includes(finding.severity)) {
      throw new Error(`Finding ${index}: Invalid severity`);
    }
  });

  return result as ReviewResult;
};

class AIEngine {
  private provider: AIProvider;

  constructor() {
    // Initialize provider based on configuration
    switch (env.AI_PROVIDER) {
      case 'openai':
        if (!env.OPENAI_API_KEY) {
          throw new Error('OPENAI_API_KEY is required for OpenAI provider');
        }
        this.provider = new OpenAIProvider(env.OPENAI_API_KEY, env.OPENAI_MODEL);
        break;
      case 'anthropic':
        if (!env.ANTHROPIC_API_KEY) {
          throw new Error('ANTHROPIC_API_KEY is required for Anthropic provider');
        }
        this.provider = new AnthropicProvider(env.ANTHROPIC_API_KEY, env.ANTHROPIC_MODEL);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${env.AI_PROVIDER}`);
    }

    logger.info('AI Engine initialized', { provider: env.AI_PROVIDER });
  }

  /**
   * Review a pull request using the configured AI provider
   * 
   * Trade-offs:
   * - Input validation ensures data quality before sending to AI
   * - Output validation ensures structured, consistent results
   * - Error handling with detailed logging for debugging
   * - Metadata tracking for AI provider performance analysis
   */
  async reviewPullRequest(input: ReviewInput): Promise<ReviewResult> {
    try {
      // Input validation
      this.validateReviewInput(input);

      logger.info('Starting AI review', {
        repository: input.repository,
        prTitle: input.title,
        fileChangesCount: input.fileChanges?.length || 0,
      });

      const startTime = Date.now();
      const result = await this.provider.reviewPullRequest(input);
      const processingTime = Date.now() - startTime;

      // Validate and enhance result
      const validatedResult = validateReviewResult(result);
      const enhancedResult = this.enhanceReviewResult(validatedResult, input, processingTime);

      logger.info('AI review completed', {
        repository: input.repository,
        findingsCount: enhancedResult.findings.length,
        overallScore: enhancedResult.overallScore,
        processingTime,
        provider: env.AI_PROVIDER,
      });

      return enhancedResult;
    } catch (error: any) {
      logger.error('AI review failed', {
        repository: input.repository,
        error: error.message,
        stack: error.stack,
      });
      
      // Return fallback result for graceful degradation
      return this.createFallbackReviewResult(input, error.message);
    }
  }

  private validateReviewInput(input: ReviewInput): void {
    if (!input.repository || !input.title || !input.author) {
      throw new Error('Repository, title, and author are required');
    }

    if (input.fileChanges && !Array.isArray(input.fileChanges)) {
      throw new Error('File changes must be an array');
    }
  }

  private enhanceReviewResult(result: ReviewResult, input: ReviewInput, processingTime: number): ReviewResult {
    return {
      ...result,
      metadata: {
        ...result.metadata,
        provider: env.AI_PROVIDER,
        processingTime,
        repository: input.repository,
        prTitle: input.title,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private createFallbackReviewResult(input: ReviewInput, error: string): ReviewResult {
    return {
      summary: `Review failed due to: ${error}`,
      overallScore: 0,
      feedback: {
        readability: "Unable to analyze due to processing error",
        security: "Unable to analyze due to processing error", 
        performance: "Unable to analyze due to processing error",
        maintainability: "Unable to analyze due to processing error",
        score: 0
      },
      findings: [],
      metadata: {
        error: error,
        fallback: true,
        repository: input.repository,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

// Singleton instance
export const aiEngine = new AIEngine();
