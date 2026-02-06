import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useOnboardingContext } from "../contexts/OnboardingContext";

export const GetStartedScreen: React.FC = () => {
  const router = useRouter();
  const { completeOnboarding, startGuidedTour } = useOnboardingContext();

  const handleGetStarted = async (): Promise<void> => {
    await completeOnboarding();
    await startGuidedTour();
    router.replace("/"); // Go to Home
  };

  const handleSkipTour = async (): Promise<void> => {
    await completeOnboarding();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You’re all set</Text>
      <Text style={styles.subtitle}>
        CodeAtlas will keep an eye on your pull requests and surface the most
        important issues.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Next up</Text>
        <Text style={styles.cardText}>
          - Connect your GitHub account from Settings
          {"\n"}- Subscribe to repos you care about
          {"\n"}- Let the AI review your next pull request
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleSkipTour}
        >
          <Text style={styles.secondaryText}>Skip tour</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.primaryText}>Start guided tour</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  secondaryText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
