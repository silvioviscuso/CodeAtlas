/**
 * Root layout for Expo Router
 * Sets up navigation and global providers
 */

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../src/contexts/AuthContext";
import { NotificationProvider } from "../src/contexts/NotificationContext";
import { OnboardingProvider } from "../src/contexts/OnboardingContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <OnboardingProvider>
              <RootLayoutContent />
            </OnboardingProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutContent() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#6366f1",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      {/* Onboarding Screens */}
      <Stack.Screen
        name="onboarding/Welcome"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="onboarding/FeatureOverview"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="onboarding/GitHubConnect"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="onboarding/Permissions"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="onboarding/GetStarted"
        options={{ headerShown: false }}
      />

      {/* Main Screens */}
      <Stack.Screen
        name="index"
        options={{
          title: "CodeAtlas",
        }}
      />
      <Stack.Screen
        name="screens/PullRequestListScreen"
        options={{
          title: "Pull Requests",
        }}
      />
      <Stack.Screen
        name="screens/PullRequestDetailScreen"
        options={{
          title: "PR Details",
        }}
      />

      {/* Auth Layout - hide header to prevent "Auth" title */}
      <Stack.Screen
        name="auth"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
