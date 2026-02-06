/**
 * Repository Slice
 * Manages repository state and operations
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/apiClient';
import { Repository, RepositoryResponse, ApiResponse, PaginatedResponse } from '../../types/api';

interface RepoState {
  repositories: Repository[];
  selectedRepoId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RepoState = {
  repositories: [],
  selectedRepoId: null,
  isLoading: false,
  error: null,
};

// Async thunks for repository operations
export const fetchRepositories = createAsyncThunk(
  'repos/fetchRepositories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<PaginatedResponse<RepositoryResponse>>('/repos');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch repositories');
    }
  }
);

export const selectRepository = createAsyncThunk(
  'repos/selectRepository',
  async (repoId: string, { rejectWithValue }) => {
    try {
      // This could be used to fetch additional repo details if needed
      return repoId;
    } catch (error: any) {
      return rejectWithValue('Failed to select repository');
    }
  }
);

const repoSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetRepos: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch repositories
      .addCase(fetchRepositories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRepositories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.repositories = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchRepositories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Select repository
      .addCase(selectRepository.fulfilled, (state, action) => {
        state.selectedRepoId = action.payload;
      })
      .addCase(selectRepository.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetRepos } = repoSlice.actions;

export default repoSlice.reducer;