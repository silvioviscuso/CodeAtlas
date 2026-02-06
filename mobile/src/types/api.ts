/**
 * API Types
 * TypeScript interfaces for API requests and responses
 */

// Authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
  };
  token: string;
}

// Simplified auth response for direct API calls
export interface DirectAuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
  };
  token: string;
}

// Repositories
export interface Repository {
  id: string;
  name: string;
  owner: string;
  defaultBranch: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface RepositoryResponse {
  id: string;
  name: string;
  owner: string;
  defaultBranch: string;
  isPrivate: boolean;
  createdAt: string;
}

// Pull Requests
export interface PullRequest {
  id: string;
  repositoryId: string;
  number: number;
  title: string;
  author: string;
  state: 'open' | 'closed' | 'merged';
  baseBranch: string;
  headBranch: string;
  createdAt: string;
  updatedAt: string;
}

export interface PullRequestResponse {
  id: string;
  repositoryId: string;
  number: number;
  title: string;
  author: string;
  state: 'open' | 'closed' | 'merged';
  baseBranch: string;
  headBranch: string;
  createdAt: string;
  updatedAt: string;
}

// Reviews
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
  score: number;
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
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  id: string;
  pullRequestId: string;
  status: string;
  result?: ReviewResult;
  createdAt: string;
}

export interface CreateReviewRequest {
  prId: string;
  priority?: number;
}

// Settings
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  autoReview: boolean;
  githubToken?: string;
  language: string;
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

// Errors
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Onboarding
export interface OnboardingState {
  hasCompletedOnboarding: boolean;
  hasCompletedTour: boolean;
  currentStep: number;
  completedSteps: string[];
}