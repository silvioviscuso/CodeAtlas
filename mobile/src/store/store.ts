/**
 * Redux Store Configuration
 * Centralized state management with Redux Toolkit
 * 
 * Trade-offs:
 * - Redux Toolkit provides better TypeScript support than Zustand
 * - Centralized state is easier to debug and test
 * - Middleware for async actions and logging
 * - Persist state across app restarts
 */

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import reducers
import authSlice from './slices/authSlice';
import repoSlice from './slices/repoSlice';
import reviewSlice from './slices/reviewSlice';
import settingsSlice from './slices/settingsSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'settings'], // Only persist auth and settings
};

// Configure store
const store = configureStore({
  reducer: {
    auth: persistReducer(persistConfig, authSlice),
    repos: repoSlice,
    reviews: reviewSlice,
    settings: persistReducer(persistConfig, settingsSlice),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;