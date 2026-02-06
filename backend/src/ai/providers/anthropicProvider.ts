/**
 * Anthropic (Claude) provider implementation
 * Uses Claude for code review with structured JSON output
 */

import axios from 'axios';
import { AIProvider, ReviewInput, ReviewResult } from '../engine';
import { prReviewPrompt } from '../prompts/prReviewPrompt';
import { logger } from '../../config/logger';

export class AnthropicProvider implements AIProvider {
  private apiKey: string;
  private model: string;
  private baseURL = 'https://api.anthropic.com/v1';

  constructor(apiKey: string, model: string = 'claude-3-opus-20240229') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async reviewPullRequest(input: ReviewInput): Promise<ReviewResult> {
    const { systemPrompt, userPrompt, schema } = prReviewPrompt(input);

    try {
      const response = await axios.post(
        `${this.baseURL}/messages`,
        {
          model: this.model,
          max_tokens: 4096,
          temperature: 0.2,
          system: `${systemPrompt}\n\nYou must respond with valid JSON matching this schema:\n${schema}`,
          messages: [
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.content[0]?.text;
      if (!content) {
        throw new Error('Empty response from Anthropic');
      }

      // Extract JSON from response (Claude may wrap in markdown)
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;

      // Parse JSON response
      const parsed = JSON.parse(jsonStr) as ReviewResult;

      // Validate structure
      this.validateReviewResult(parsed);

      return {
        ...parsed,
        metadata: {
          provider: 'anthropic',
          model: this.model,
          tokensUsed: response.data.usage?.input_tokens + response.data.usage?.output_tokens,
        },
      };
    } catch (error: any) {
      logger.error('Anthropic API error', {
        error: error.message,
        repository: input.repository,
      });
      throw new Error(`Anthropic review failed: ${error.message}`);
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
