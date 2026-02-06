import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { Github } from "lucide-react-native";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";

interface Props {
  onboardingMode?: boolean;
}

export const AuthScreen: React.FC<Props> = ({ onboardingMode = false }) => {
  const { login, logout, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      // In production, this would trigger GitHub OAuth flow
      // For now, we'll simulate a successful login
      Alert.alert(
        "GitHub Authentication",
        "In production, this would open GitHub OAuth. For now, configure your backend with GitHub OAuth credentials.",
        [{ text: "OK" }],
      );
    } catch (error) {
      Alert.alert(
        "Authentication Error",
        "Failed to authenticate with GitHub. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  if (isAuthenticated && user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            You're signed in as {user.name || user.email}
          </Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name || "User"}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {user.githubUsername && (
              <Text style={styles.userGithub}>@{user.githubUsername}</Text>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.replace("/")}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? "Loading..." : "Continue to App"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign in to CodeAtlas</Text>
        <Text style={styles.subtitle}>
          Connect your GitHub account to get started with AI-powered code
          reviews
        </Text>
      </View>

      <View style={styles.authOptions}>
        <TouchableOpacity
          style={[styles.authButton, styles.githubButton]}
          onPress={handleGitHubLogin}
          disabled={isLoading}
        >
          <View style={styles.authButtonContent}>
            <View style={styles.githubIcon}>
              <Github width={24} height={24} color="#ffffff" />
            </View>
            <Text style={styles.authButtonText}>
              {isLoading ? "Signing in..." : "Sign in with GitHub"}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={[styles.authButton, styles.emailButton]}
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Email authentication will be available soon.",
            )
          }
        >
          <View style={styles.authButtonContent}>
            <View style={styles.emailIcon}>
              <Text style={styles.emailIconText}>@</Text>
            </View>
            <Text style={styles.authButtonText}>Sign in with Email</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By signing in, you agree to our{" "}
          <Text style={styles.linkText}>Terms of Service</Text> and{" "}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#64748b",
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  userGithub: {
    fontSize: 12,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  authOptions: {
    marginBottom: 30,
  },
  authButton: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  githubButton: {
    backgroundColor: "#1f2937",
  },
  emailButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  authButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  githubIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  githubIconText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
  },
  emailIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  emailIconText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#64748b",
  },
  authButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "600",
  },
  actions: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: "#6366f1",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748b",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
  linkText: {
    color: "#6366f1",
    fontWeight: "700",
  },
});
