/**
 * Global app store (Zustand)
 * Holds lightweight UI/global flags such as onboarding/tour state.
 *
 * Trade-off:
 * - We keep this store small and focused on app-wide UI flags to avoid
 *   over-centralizing all state here. Server data continues to live in
 *   React Query, and auth lives in its dedicated context.
 */

import { create } from 'zustand';

interface AppState {
  hasCompletedOnboarding: boolean;
  hasCompletedTour: boolean;
  isTourActive: boolean;
  currentTourStep: 'home' | 'prList' | 'reviewDetail' | 'idle';
  setHasCompletedOnboarding: (value: boolean) => void;
  setHasCompletedTour: (value: boolean) => void;
  startTour: () => void;
  endTour: () => void;
  setTourStep: (step: AppState['currentTourStep']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  hasCompletedOnboarding: false,
  hasCompletedTour: false,
  isTourActive: false,
  currentTourStep: 'idle',
  setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
  setHasCompletedTour: (value) => set({ hasCompletedTour: value }),
  startTour: () => set({ isTourActive: true, currentTourStep: 'home', hasCompletedTour: false }),
  endTour: () => set({ isTourActive: false, currentTourStep: 'idle', hasCompletedTour: true }),
  setTourStep: (step) => set({ currentTourStep: step }),
}));

