import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Github } from "lucide-react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { useRouter } from "expo-router";

interface Props {
  onboardingMode?: boolean;
  onSwitchToSignup?: () => void;
}

export default function LoginScreen({
  onboardingMode = false,
  onSwitchToSignup,
}: Props) {
  const { login, logout, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      // In production, this would trigger GitHub OAuth flow
      Alert.alert(
        "GitHub Authentication",
        "In production, this would open GitHub OAuth. For now, configure your backend with GitHub OAuth credentials.",
        [{ text: "OK" }],
      );
      // Navigate to the main app after GitHub auth attempt
      if (onboardingMode) {
        router.push("/onboarding/FeatureOverview");
      } else {
        router.replace("/");
      }
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

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // In production, this would call the login API
      Alert.alert(
        "Coming Soon",
        "Email authentication will be available soon. For now, use GitHub authentication.",
        [{ text: "OK" }],
      );
    } catch (error) {
      Alert.alert("Login Error", "Invalid credentials. Please try again.", [
        { text: "OK" },
      ]);
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.content}>
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

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => {
                if (onboardingMode) {
                  router.push("/onboarding/FeatureOverview");
                } else {
                  router.replace("/");
                }
              }}
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
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.content}>
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

          <View style={styles.emailForm}>
            <Text style={styles.formTitle}>Sign in with Email</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Text style={styles.passwordToggleText}>
                    {isPasswordVisible ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleEmailLogin}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onSwitchToSignup}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By signing in, you agree to our{" "}
            <Text style={styles.linkText}>Terms of Service</Text> and{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
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
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#64748b",
  },
  userInfo: {
    alignItems: "center",
  },
  actionsContainer: {
    gap: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  authOptions: {
    marginBottom: 30,
  },
  authButton: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  githubButton: {
    backgroundColor: "#1f2937",
  },
  authButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  githubIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  githubIconText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#ffffff",
  },
  authButtonText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "700",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
  },
  emailForm: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    top: 12,
  },
  passwordToggleText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  button: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: "#6366f1",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#64748b",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: "#64748b",
  },
  signupLink: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "800",
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
    fontWeight: "800",
  },
});
