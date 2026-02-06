/**
 * Signin Screen
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useOnboardingContext } from "../../src/contexts/OnboardingContext";
import { LoginScreen } from "../auth/LoginScreen";

export default function SigninScreen() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { startGuidedTour, resetOnboardingForTesting } = useOnboardingContext();

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!isAuthenticated ? (
        <LoginScreen />
      ) : (
        <>
          {/* User Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{user?.name || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            {user?.githubUsername && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>GitHub</Text>
                <Text style={styles.infoValue}>@{user.githubUsername}</Text>
              </View>
            )}
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <Text style={styles.sectionDescription}>
              Configure when you receive notifications about PR reviews
            </Text>
            {/* Future: notification preferences */}
          </View>

          {/* Help / Tour */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help & Tour</Text>
            <Text style={styles.sectionDescription}>
              Re-run the guided tour to highlight key areas of the app.
            </Text>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={async () => {
                await startGuidedTour();
                router.replace("/");
              }}
            >
              <Text style={styles.secondaryButtonText}>Start guided tour</Text>
            </TouchableOpacity>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.version}>Version 0.1.0</Text>
            <Text style={styles.sectionDescription}>
              CodeAtlas - AI-powered code review assistant
            </Text>
          </View>

          {/* Sign Out */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  authSection: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  version: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ef4444",
    marginTop: 8,
  },
  logoutButtonText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
});
