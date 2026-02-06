/**
 * Authentication Slice
 * Manages user authentication state and tokens
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/apiClient';
import { TokenService } from '../../services/tokenService';
import { DirectAuthResponse, LoginRequest, RegisterRequest, ApiResponse } from '../../types/api';

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<DirectAuthResponse>('/auth/login', credentials);
      const { user, token } = response;
      
      // Store token using TokenService
      await TokenService.setToken(token);
      
      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<DirectAuthResponse>('/auth/register', userData);
      const { user, token } = response;
      
      // Store token using TokenService
      await TokenService.setToken(token);
      
      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await TokenService.removeToken();
      return null;
    } catch (error: any) {
      return rejectWithValue('Logout failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = await TokenService.getToken();
      if (!token) {
        return rejectWithValue('No token found');
      }

      // Verify token with server
      const response = await apiClient.get<DirectAuthResponse>('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { user: response.user, token };
    } catch (error: any) {
      await TokenService.removeToken();
      return rejectWithValue('Token verification failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, (state) => {
        state.error = 'Logout failed';
      })
      
      // Check auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;

export default authSlice.reducer;