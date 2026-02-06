/**
 * Review Slice
 * Manages review state and operations
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/apiClient';
import { Review, ReviewResponse, CreateReviewRequest, ApiResponse } from '../../types/api';

interface ReviewState {
  reviews: Review[];
  selectedReviewId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  selectedReviewId: null,
  isLoading: false,
  error: null,
};

// Async thunks for review operations
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (prId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ReviewResponse[]>(`/reviews/pr/${prId}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData: CreateReviewRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ReviewResponse>('/reviews', reviewData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetReviews: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
        state.error = null;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create review
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.push(action.payload);
        state.error = null;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetReviews } = reviewSlice.actions;

export default reviewSlice.reducer;