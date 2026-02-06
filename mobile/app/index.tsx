import React from "react";
import { useAuth } from "../src/contexts/AuthContext";
import { useRouter } from "expo-router";

export default function RootLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    // Wait for the layout to be ready before navigating
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/auth/HomeScreen");
      } else {
        router.replace("/auth/StartupScreen");
      }
    }, 100); // Small delay to ensure layout is mounted

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return null; // This component just handles routing
}
