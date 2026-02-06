/**
 * API Client
 * Centralized HTTP client for all API requests
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Alert } from 'react-native';
import { TokenService } from '../services/tokenService';

// API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const API_VERSION = process.env.EXPO_PUBLIC_API_VERSION || 'v1';

interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        // Get token from TokenService
        const token = await TokenService.getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          Alert.alert(
            'Session Expired',
            'Please log in again.',
            [{ text: 'OK', onPress: () => this.handleLogout() }]
          );
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  private formatError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Server error',
        code: error.response.status.toString(),
        details: error.response.data,
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  private handleLogout() {
    // Clear token and dispatch logout action
    TokenService.removeToken();
    // Note: We can't dispatch directly here due to circular dependency
    // The logout will be handled by the auth slice when token is removed
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();