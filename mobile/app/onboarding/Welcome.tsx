import React from "react";
import { WelcomeScreen } from "../../src/onboarding/WelcomeScreen";
import { useOnboardingContext } from "../../src/contexts/OnboardingContext";

export default function WelcomeRoute() {
  const { completeOnboarding } = useOnboardingContext();

  return (
    <WelcomeScreen
      onSkip={async () => {
        await completeOnboarding();
      }}
    />
  );
}
