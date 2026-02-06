/**
 * OpenAI provider implementation
 * Uses GPT-4 for code review with structured JSON output
 */

import axios from 'axios';
import { AIProvider, ReviewInput, ReviewResult } from '../engine';
import { prReviewPrompt } from '../prompts/prReviewPrompt';
import { logger } from '../../config/logger';

export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private model: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor(apiKey: string, model: string = 'gpt-4-turbo-preview') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async reviewPullRequest(input: ReviewInput): Promise<ReviewResult> {
    const { systemPrompt, userPrompt, schema } = prReviewPrompt(input);

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `${systemPrompt}\n\nYou must respond with valid JSON matching this schema:\n${schema}`,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          response_format: { type: 'json_object' }, // Force JSON mode
          temperature: 0.2, // Lower temperature for more consistent reviews
          max_tokens: 4000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      // Parse JSON response
      const parsed = JSON.parse(content) as ReviewResult;

      // Validate structure
      this.validateReviewResult(parsed);

      return {
        ...parsed,
        metadata: {
          provider: 'openai',
          model: this.model,
          tokensUsed: response.data.usage?.total_tokens,
        },
      };
    } catch (error: any) {
      logger.error('OpenAI API error', {
        error: error.message,
        repository: input.repository,
      });
      throw new Error(`OpenAI review failed: ${error.message}`);
    }
  }

  /**
   * Validate review result structure
   */
  private validateReviewResult(result: ReviewResult): void {
    if (!result.summary || typeof result.summary !== 'string') {
      throw new Error('Invalid review result: missing summary');
    }

    if (typeof result.overallScore !== 'number' || result.overallScore < 0 || result.overallScore > 100) {
      throw new Error('Invalid review result: overallScore must be 0-100');
    }

    if (!Array.isArray(result.findings)) {
      throw new Error('Invalid review result: findings must be an array');
    }

    // Validate each finding
    for (const finding of result.findings) {
      const validCategories = ['readability', 'bug', 'security', 'performance', 'maintainability'];
      const validSeverities = ['low', 'medium', 'high', 'critical'];

      if (!validCategories.includes(finding.category)) {
        throw new Error(`Invalid finding category: ${finding.category}`);
      }

      if (!validSeverities.includes(finding.severity)) {
        throw new Error(`Invalid finding severity: ${finding.severity}`);
      }

      if (!finding.title || !finding.description) {
        throw new Error('Invalid finding: missing title or description');
      }
    }
  }
}
