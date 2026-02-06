import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Github } from "lucide-react-native";
import { useRouter } from "expo-router";

interface Props {
  onSwitchToLogin: () => void;
}

export default function SignupScreen({ onSwitchToLogin }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      // In production, this would call the signup API
      Alert.alert(
        "Coming Soon",
        "Email signup will be available soon. For now, use GitHub authentication.",
        [{ text: "OK" }],
      );
    } catch (error) {
      Alert.alert(
        "Signup Error",
        "Failed to create account. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join CodeAtlas to get started with AI-powered code reviews
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Sign up with Email</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#94a3b8"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

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
                placeholder="Create a password"
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

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!isConfirmPasswordVisible}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
              >
                <Text style={styles.passwordToggleText}>
                  {isConfirmPasswordVisible ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={onSwitchToLogin}>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.githubContainer}>
          <Text style={styles.githubTitle}>Sign up with GitHub</Text>
          <Text style={styles.githubSubtitle}>
            Connect your GitHub account to get started instantly
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.githubButton]}
            onPress={() => {
              Alert.alert(
                "GitHub Authentication",
                "In production, this would open GitHub OAuth. For now, configure your backend with GitHub OAuth credentials.",
                [{ text: "OK" }],
              );
            }}
          >
            <View style={styles.githubButtonContent}>
              <View style={styles.githubIcon}>
                <Github width={24} height={24} color="#ffffff" />
              </View>
              <Text style={styles.githubButtonText}>Sign up with GitHub</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By signing up, you agree to our{" "}
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
    marginBottom: 24,
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
  form: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
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
  githubButton: {
    backgroundColor: "#1f2937",
  },
  githubButtonContent: {
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
  githubButtonText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: "#64748b",
  },
  loginLink: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "800",
  },
  dividerContainer: {
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
  githubContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  githubTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  githubSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
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
