import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { Github } from "lucide-react-native";

export default function StartupScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Skip startup if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Don't render anything if already authenticated
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>CA</Text>
          </View>
          <Text style={styles.logoSubtitle}>CodeAtlas</Text>
        </View>

        <Text style={styles.heroTitle}>AI-Powered Code Review Assistant</Text>
        <Text style={styles.heroSubtitle}>
          Get intelligent insights, security analysis, and performance
          recommendations for your pull requests - all in one place.
        </Text>
      </View>

      {/* Features Section */}
      <View style={styles.features}>
        <Text style={styles.sectionTitle}>What CodeAtlas Offers</Text>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureIconText}>🔍</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Smart Analysis</Text>
            <Text style={styles.featureDescription}>
              AI-powered code review that catches bugs, security issues, and
              performance problems before they reach production.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureIconText}>🛡️</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Security First</Text>
            <Text style={styles.featureDescription}>
              Comprehensive security analysis to identify vulnerabilities and
              potential exploits in your code.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureIconText}>⚡</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Performance Insights</Text>
            <Text style={styles.featureDescription}>
              Get actionable recommendations to optimize your code's performance
              and efficiency.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureIconText}>📊</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Detailed Reports</Text>
            <Text style={styles.featureDescription}>
              Comprehensive review summaries with severity ratings and
              prioritized action items.
            </Text>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.cta}>
        <Text style={styles.ctaTitle}>Ready to Supercharge Your Code?</Text>
        <Text style={styles.ctaSubtitle}>
          Join thousands of developers who trust CodeAtlas for their code review
          needs.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push("/auth/LoginScreen")}
          >
            <View style={styles.buttonContent}>
              <Github width={20} height={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Sign in with GitHub</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push("/auth/SignupScreen")}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.securityText}>
          Secure authentication • No code storage • Privacy first
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          CodeAtlas helps you write better, safer, and more efficient code.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: "#6366f1",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 40,
    paddingBottom: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#6366f1",
  },
  logoSubtitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#e5e7eb",
    textAlign: "center",
    lineHeight: 24,
  },
  features: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 20,
    textAlign: "center",
  },
  featureCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  cta: {
    backgroundColor: "#ffffff",
    margin: 24,
    borderRadius: 20,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
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
  },
  primaryButton: {
    backgroundColor: "#1f2937",
  },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#374151",
  },
  securityText: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
  footer: {
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
