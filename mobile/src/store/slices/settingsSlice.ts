/**
 * Settings Slice
 * Manages user settings and preferences
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/apiClient';
import { TokenService } from '../../services/tokenService';
import { UserSettings, ApiResponse } from '../../types/api';

interface SettingsState {
  settings: UserSettings;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: {
    theme: 'system',
    notifications: true,
    autoReview: false,
    language: 'en',
  },
  isLoading: false,
  error: null,
};

// Async thunks for settings operations
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<UserSettings>('/settings');
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settings: Partial<UserSettings>, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<UserSettings>('/settings', settings);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSettings: () => initialState,
    updateLocalSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = { ...state.settings, ...action.payload };
        state.error = null;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update settings
      .addCase(updateSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = { ...state.settings, ...action.payload };
        state.error = null;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetSettings, updateLocalSettings } = settingsSlice.actions;

export default settingsSlice.reducer;