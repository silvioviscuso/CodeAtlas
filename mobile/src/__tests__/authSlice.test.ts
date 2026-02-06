/**
 * Authentication Slice Tests
 * Unit tests for Redux auth slice
 */

import { configureStore } from '@reduxjs/toolkit';
import authSlice, { loginUser, registerUser, logoutUser, checkAuth } from '../store/slices/authSlice';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock apiClient
jest.mock('../api/apiClient', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('authSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authSlice,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth;
      
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('loginUser', () => {
    it('should login successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };
      const mockToken = 'mock-jwt-token';

      // Mock successful API response
      const { apiClient } = require('../api/apiClient');
      apiClient.post.mockResolvedValue({
        data: {
          user: mockUser,
          token: mockToken,
        },
      });

      // Mock AsyncStorage
      const { setItem } = require('@react-native-async-storage/async-storage');
      setItem.mockResolvedValue(undefined);

      await store.dispatch(loginUser({
        email: 'test@example.com',
        password: 'password123',
      }));

      const state = store.getState().auth;

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle login failure', async () => {
      // Mock failed API response
      const { apiClient } = require('../api/apiClient');
      apiClient.post.mockRejectedValue({
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      });

      await store.dispatch(loginUser({
        email: 'test@example.com',
        password: 'wrongpassword',
      }));

      const state = store.getState().auth;

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Invalid credentials');
    });
  });

  describe('registerUser', () => {
    it('should register successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };
      const mockToken = 'mock-jwt-token';

      // Mock successful API response
      const { apiClient } = require('../api/apiClient');
      apiClient.post.mockResolvedValue({
        data: {
          user: mockUser,
          token: mockToken,
        },
      });

      // Mock AsyncStorage
      const { setItem } = require('@react-native-async-storage/async-storage');
      setItem.mockResolvedValue(undefined);

      await store.dispatch(registerUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }));

      const state = store.getState().auth;

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('logoutUser', () => {
    it('should logout successfully', async () => {
      // Set initial state
      store.dispatch(loginUser.fulfilled({
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        token: 'mock-token',
      }, '', {
        email: 'test@example.com',
        password: 'password123',
      }));

      // Mock AsyncStorage
      const { removeItem } = require('@react-native-async-storage/async-storage');
      removeItem.mockResolvedValue(undefined);

      await store.dispatch(logoutUser());

      const state = store.getState().auth;

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('checkAuth', () => {
    it('should check auth successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      // Mock AsyncStorage
      const { getItem } = require('@react-native-async-storage/async-storage');
      getItem.mockResolvedValue('mock-token');

      // Mock successful API response
      const { apiClient } = require('../api/apiClient');
      apiClient.get.mockResolvedValue({
        data: {
          user: mockUser,
        },
      });

      await store.dispatch(checkAuth());

      const state = store.getState().auth;

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('mock-token');
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle auth check failure', async () => {
      // Mock AsyncStorage
      const { getItem, removeItem } = require('@react-native-async-storage/async-storage');
      getItem.mockResolvedValue('invalid-token');
      removeItem.mockResolvedValue(undefined);

      // Mock failed API response
      const { apiClient } = require('../api/apiClient');
      apiClient.get.mockRejectedValue({
        response: {
          data: {
            message: 'Token verification failed',
          },
        },
      });

      await store.dispatch(checkAuth());

      const state = store.getState().auth;

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull(); // Error is handled internally
    });
  });

  describe('reducers', () => {
    it('should clear error', () => {
      // Set error state
      store.dispatch({ type: 'auth/login/rejected', payload: 'Test error' });

      let state = store.getState().auth;
      expect(state.error).toBe('Test error');

      // Clear error
      store.dispatch({ type: 'auth/clearError' });

      state = store.getState().auth;
      expect(state.error).toBeNull();
    });

    it('should reset auth', () => {
      // Set authenticated state
      store.dispatch(loginUser.fulfilled({
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        token: 'mock-token',
      }, '', {
        email: 'test@example.com',
        password: 'password123',
      }));

      let state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);

      // Reset auth
      store.dispatch({ type: 'auth/resetAuth' });

      state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});