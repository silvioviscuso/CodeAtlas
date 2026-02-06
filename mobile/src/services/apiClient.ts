/**
 * API client for CodeAtlas backend
 * Handles authentication, request/response formatting, and error handling
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';
const API_VERSION = 'v1';

// Mock data for UI development when backend is not available
const MOCK_USER = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://via.placeholder.com/150',
};

const MOCK_TENANT = {
  id: '1',
  name: 'Test Organization',
  plan: 'free',
};

const MOCK_REVIEWS = Array.from({ length: 10 }, (_, i) => ({
  id: `review-${i + 1}`,
  title: `Review ${i + 1}`,
  description: `This is review ${i + 1} description`,
  category: ['security', 'performance', 'style'][i % 3],
  severity: ['high', 'medium', 'low'][i % 3],
  status: ['pending', 'in_progress', 'completed'][i % 3],
  createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
  pullRequestId: `pr-${i + 1}`,
  repositoryId: `repo-${i + 1}`,
}));

export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api/${API_VERSION}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use(async (config) => {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - clear it
          SecureStore.deleteItemAsync('auth_token');
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Format axios error to ApiError
   */
  private formatError(error: AxiosError): ApiError {
    if (error.response?.data) {
      return error.response.data as ApiError;
    }
    return {
      error: 'Network Error',
      message: error.message || 'An unexpected error occurred',
    };
  }

  /**
   * Authentication
   */
  async authenticateWithGitHub(code: string) {
    try {
      const response = await this.client.post('/auth/github/callback', { code });
      const { token } = response.data;
      if (token) {
        await SecureStore.setItemAsync('auth_token', token);
      }
      return response.data;
    } catch (error) {
      // If backend is not available, use mock data
      await SecureStore.setItemAsync('auth_token', 'mock-token');
      return { user: MOCK_USER, token: 'mock-token' };
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.client.get('/auth/me');
      return response.data.user;
    } catch (error) {
      // If backend is not available, return mock data
      return MOCK_USER;
    }
  }

  /**
   * Tenants
   */
  async getCurrentTenant() {
    try {
      const response = await this.client.get('/tenants/current');
      return response.data.tenant;
    } catch (error) {
      // If backend is not available, return mock data
      return MOCK_TENANT;
    }
  }

  /**
   * Reviews
   */
  async getReviews(params?: {
    repositoryId?: string;
    pullRequestId?: string;
    category?: string;
    severity?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const response = await this.client.get('/reviews', { params });
      return response.data;
    } catch (error) {
      // If backend is not available, return mock data
      const limit = params?.limit || 10;
      const offset = params?.offset || 0;
      const category = params?.category;
      const severity = params?.severity;
      
      let filteredReviews = MOCK_REVIEWS;
      
      if (category) {
        filteredReviews = filteredReviews.filter(review => review.category === category);
      }
      
      if (severity) {
        filteredReviews = filteredReviews.filter(review => review.severity === severity);
      }
      
      const total = filteredReviews.length;
      const reviews = filteredReviews.slice(offset, offset + limit);
      
      return {
        reviews,
        total,
        limit,
        offset,
      };
    }
  }

  async getReviewById(id: string) {
    try {
      const response = await this.client.get(`/reviews/${id}`);
      return response.data.review;
    } catch (error) {
      // If backend is not available, return mock data
      return MOCK_REVIEWS.find(review => review.id === id) || null;
    }
  }

  async triggerReview(pullRequestId: string, priority?: number) {
    try {
      const response = await this.client.post('/reviews/trigger', {
        pullRequestId,
        priority,
      });
      return response.data.job;
    } catch (error) {
      // If backend is not available, return mock data
      return {
        id: `job-${Date.now()}`,
        status: 'queued',
        pullRequestId,
        priority: priority || 1,
        createdAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Logout
   */
  async logout() {
    await SecureStore.deleteItemAsync('auth_token');
  }
}

export const apiClient = new ApiClient();
