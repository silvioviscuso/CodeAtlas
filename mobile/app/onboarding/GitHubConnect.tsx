import React from "react";
import { LoginScreen } from "../auth/LoginScreen";

export default function GitHubConnectRoute() {
  return <LoginScreen onboardingMode={true} />;
}
