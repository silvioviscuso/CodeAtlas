/**
 * Onboarding Context
 * Manages onboarding state without creating circular dependencies
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OnboardingContextType {
  isOnboardingLoading: boolean;
  hasCompletedOnboarding: boolean;
  hasCompletedTour: boolean;
  isTourActive: boolean;
  currentTourStep: "home" | "prList" | "reviewDetail" | "idle";
  completeOnboarding: () => Promise<void>;
  resetOnboardingForTesting: () => Promise<void>;
  startGuidedTour: () => Promise<void>;
  completeGuidedTour: () => Promise<void>;
  setTourStep: (step: "home" | "prList" | "reviewDetail" | "idle") => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error(
      "useOnboardingContext must be used within an OnboardingProvider",
    );
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState<
    "home" | "prList" | "reviewDetail" | "idle"
  >("idle");

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const [onboardingRaw, tourRaw] = await Promise.all([
          AsyncStorage.getItem("hasCompletedOnboarding"),
          AsyncStorage.getItem("hasCompletedTour"),
        ]);

        if (onboardingRaw === "true") {
          setHasCompletedOnboarding(true);
        }
        if (tourRaw === "true") {
          setHasCompletedTour(true);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const completeOnboarding = async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.setItem("hasCompletedOnboarding", "true"),
        AsyncStorage.setItem("hasCompletedTour", "true"),
      ]);
      setHasCompletedOnboarding(true);
      setHasCompletedTour(true);
    } catch (error) {
      console.error("Error marking onboarding as complete:", error);
    }
  };

  const resetOnboardingForTesting = async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.removeItem("hasCompletedOnboarding"),
        AsyncStorage.removeItem("hasCompletedTour"),
      ]);
      setHasCompletedOnboarding(false);
      setHasCompletedTour(false);
    } catch (error) {
      console.error("Error resetting onboarding:", error);
    }
  };

  const startGuidedTour = async (): Promise<void> => {
    setIsTourActive(true);
    setCurrentTourStep("home");

    try {
      await AsyncStorage.setItem("hasCompletedTour", "false");
    } catch (error) {
      console.error("Error starting tour:", error);
    }
  };

  const completeGuidedTour = async (): Promise<void> => {
    setIsTourActive(false);
    setCurrentTourStep("idle");

    try {
      await AsyncStorage.setItem("hasCompletedTour", "true");
      setHasCompletedTour(true);
    } catch (error) {
      console.error("Error completing tour:", error);
    }
  };

  const setTourStep = (step: "home" | "prList" | "reviewDetail" | "idle") => {
    setCurrentTourStep(step);
  };

  const value: OnboardingContextType = {
    isOnboardingLoading: isLoading,
    hasCompletedOnboarding,
    hasCompletedTour,
    isTourActive,
    currentTourStep,
    completeOnboarding,
    resetOnboardingForTesting,
    startGuidedTour,
    completeGuidedTour,
    setTourStep,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
