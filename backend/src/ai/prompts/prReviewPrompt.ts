/**
 * Structured prompts for AI code review
 * Ensures consistent, reproducible outputs with typed JSON responses
 */

import { ReviewInput } from '../engine';

export interface ReviewPromptContext {
  repository: string;
  title: string;
  author: string;
  diffSummary: string;
  fileChanges?: Array<{
    path: string;
    additions: number;
    deletions: number;
  }>;
}

/**
 * Build the system prompt for code review
 */
export function buildSystemPrompt(): string {
  return `You are an expert code reviewer analyzing pull requests for professional software teams.

Your role:
- Identify code quality issues, bugs, security vulnerabilities, and performance problems
- Provide actionable, constructive feedback
- Focus on maintainability, readability, and best practices
- Be specific: reference file paths, line numbers, and code snippets when possible

Review categories:
1. **Readability**: Code clarity, naming, documentation, structure
2. **Bug**: Logic errors, edge cases, potential runtime issues
3. **Security**: Vulnerabilities, injection risks, authentication/authorization issues
4. **Performance**: Inefficient algorithms, unnecessary operations, scalability concerns
5. **Maintainability**: Code duplication, complexity, technical debt

Severity levels:
- **critical**: Must fix before merge (security vulnerabilities, data loss risks)
- **high**: Should fix before merge (bugs, major performance issues)
- **medium**: Should address soon (code quality, minor bugs)
- **low**: Nice to have (style, minor optimizations)

Output format: You must respond with valid JSON matching the specified schema.`;
}

/**
 * Build the user prompt with PR context
 */
export function buildUserPrompt(input: ReviewInput): string {
  const fileSummary = input.fileChanges
    ? `\n\nFile changes:\n${input.fileChanges
        .map((f) => `- ${f.path} (+${f.additions}/-${f.deletions})`)
        .join('\n')}`
    : '';

  return `Review this pull request:

Repository: ${input.repository}
Title: ${input.title}
Author: ${input.author}
Base branch: ${input.baseBranch}
Head branch: ${input.headBranch}${fileSummary}

Diff summary:
\`\`\`
${input.diffSummary}
\`\`\`

Provide a comprehensive code review in the following JSON format:
{
  "summary": "High-level summary of the PR and overall code quality (2-3 sentences)",
  "overallScore": 85,
  "findings": [
    {
      "category": "security",
      "severity": "high",
      "filePath": "src/auth.ts",
      "lineStart": 42,
      "lineEnd": 45,
      "title": "Potential SQL injection vulnerability",
      "description": "User input is directly concatenated into SQL query without parameterization",
      "suggestion": "Use parameterized queries or Prisma's query builder",
      "codeSnippet": "const query = \`SELECT * FROM users WHERE id = \${userId}\`;"
    }
  ]
}

Guidelines:
- Be thorough but concise
- Prioritize actionable feedback
- Include specific file paths and line numbers when possible
- Provide code snippets for context
- Focus on issues that matter for production code`;
}

/**
 * Get the expected JSON schema for validation
 */
export function getReviewResultSchema(): string {
  return JSON.stringify({
    type: 'object',
    required: ['summary', 'overallScore', 'findings'],
    properties: {
      summary: { type: 'string' },
      overallScore: { type: 'number', minimum: 0, maximum: 100 },
      findings: {
        type: 'array',
        items: {
          type: 'object',
          required: ['category', 'severity', 'title', 'description'],
          properties: {
            category: {
              type: 'string',
              enum: ['readability', 'bug', 'security', 'performance', 'maintainability'],
            },
            severity: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
            },
            filePath: { type: 'string' },
            lineStart: { type: 'number' },
            lineEnd: { type: 'number' },
            title: { type: 'string' },
            description: { type: 'string' },
            suggestion: { type: 'string' },
            codeSnippet: { type: 'string' },
          },
        },
      },
    },
  });
}

/**
 * Main prompt builder (combines system + user prompts)
 */
export function prReviewPrompt(input: ReviewInput): {
  systemPrompt: string;
  userPrompt: string;
  schema: string;
} {
  return {
    systemPrompt: buildSystemPrompt(),
    userPrompt: buildUserPrompt(input),
    schema: getReviewResultSchema(),
  };
}
