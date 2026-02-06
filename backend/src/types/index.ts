/**
 * Core TypeScript interfaces and types for CodeAtlas
 */

// Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  githubId?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  userId: string;
  tenantId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

// GitHub Integration
export interface Repository {
  id: string;
  tenantId: string;
  githubId: number;
  name: string;
  owner: string;
  defaultBranch: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PullRequest {
  id: string;
  repositoryId: string;
  number: number;
  githubNodeId: string;
  title: string;
  author: string;
  state: 'open' | 'closed' | 'merged';
  baseBranch: string;
  headBranch: string;
  headSha: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GitHubWebhookPayload {
  action: string;
  repository: {
    id: number;
    name: string;
    owner: { login: string };
    default_branch: string;
  };
  pull_request: {
    number: number;
    node_id: string;
    title: string;
    user: { login: string };
    state: string;
    base: { ref: string };
    head: { ref: string; sha: string };
  };
}

// AI Review Engine
export interface ReviewInput {
  repository: string;
  title: string;
  author: string;
  baseBranch: string;
  headBranch: string;
  diffSummary: string;
  fileChanges?: FileChange[];
}

export interface FileChange {
  path: string;
  additions: number;
  deletions: number;
  diff: string;
}

export interface ReviewFinding {
  category: 'readability' | 'security' | 'performance' | 'maintainability' | 'bug';
  severity: 'low' | 'medium' | 'high' | 'critical';
  filePath?: string;
  lineStart?: number;
  lineEnd?: number;
  title: string;
  description: string;
  suggestion?: string;
  codeSnippet?: string;
}

export interface ReviewFeedback {
  readability: string;
  security: string;
  performance: string;
  maintainability: string;
  score: number; // 0-100
}

export interface ReviewResult {
  summary: string;
  overallScore: number;
  feedback: ReviewFeedback;
  findings: ReviewFinding[];
  metadata?: Record<string, unknown>;
}

export interface Review {
  id: string;
  pullRequestId: string;
  reviewerId: string;
  status: 'pending' | 'completed' | 'failed';
  result?: ReviewResult;
  createdAt: Date;
  updatedAt: Date;
}

// API Responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request/Response DTOs
export interface CreateReviewRequest {
  prId: string;
  priority?: number;
}

export interface ReviewResponse {
  id: string;
  pullRequestId: string;
  status: string;
  result?: ReviewResult;
  createdAt: Date;
}

export interface RepositoryResponse {
  id: string;
  name: string;
  owner: string;
  defaultBranch: string;
  isPrivate: boolean;
  createdAt: Date;
}

// Error handling
export interface AppError extends Error {
  statusCode: number;
  code?: string;
  details?: any;
}

// AI Provider interface
export interface AIProvider {
  reviewPullRequest(input: ReviewInput): Promise<ReviewResult>;
}

// Configuration
export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiVersion: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  databaseUrl: string;
  aiProvider: 'openai' | 'anthropic';
  openaiApiKey?: string;
  openaiModel?: string;
  anthropicApiKey?: string;
  anthropicModel?: string;
  githubClientId: string;
  githubClientSecret: string;
  githubWebhookSecret: string;
  logLevel: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  githubApiBaseUrl: string;
  allowedOrigins: string[];
}