import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../src/contexts/AuthContext";
import { apiClient } from "../../src/services/apiClient";
import { ReviewSummaryCard } from "../../src/components/ReviewSummaryCard";
import { TourOverlay } from "../../src/onboarding/TourOverlay";
import { useOnboardingContext } from "../../src/contexts/OnboardingContext";
import { Github, Plus, Bell, Settings, BarChart3 } from "lucide-react-native";

export default function AuthenticatedHomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { isTourActive, currentTourStep, setTourStep, completeGuidedTour } =
    useOnboardingContext();

  // Fetch recent reviews
  const {
    data: reviewsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reviews", "recent"],
    queryFn: () => apiClient.getReviews({ limit: 10 }),
    enabled: isAuthenticated,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!isAuthenticated) {
    return null; // This should not happen, but just in case
  }

  const shouldShowHomeTour = isTourActive && currentTourStep === "home";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Welcome back, {user?.name || user?.email}
            </Text>
            <Text style={styles.subtitle}>Your AI-powered code review hub</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Bell width={20} height={20} color="#6366f1" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push("/screens/SigninScreen")}
            >
              <Settings width={20} height={20} color="#6366f1" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={[styles.statCard, styles.primaryStat]}>
            <View style={styles.statIcon}>
              <BarChart3 width={24} height={24} color="#ffffff" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>
                {reviewsData?.reviews.length || 0}
              </Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statCard, styles.secondaryStat]}>
            <View style={styles.statIcon}>
              <Github width={24} height={24} color="#ffffff" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Repositories</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reviews</Text>
            <TouchableOpacity
              style={styles.sectionButton}
              onPress={() => router.push("/screens/PullRequestListScreen")}
            >
              <Text style={styles.sectionButtonText}>View All</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loaderText}>Loading reviews...</Text>
            </View>
          ) : reviewsData?.reviews.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No reviews yet</Text>
              <Text style={styles.emptySubtext}>
                Connect a repository to start receiving AI-powered code reviews
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push("/screens/SigninScreen")}
              >
                <Text style={styles.emptyButtonText}>Connect Repository</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {reviewsData?.reviews.map((review: any) => (
                <ReviewSummaryCard
                  key={review.id}
                  review={review}
                  onPress={() =>
                    router.push(
                      `/screens/PullRequestDetailScreen?id=${review.id}`,
                    )
                  }
                />
              ))}
            </>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionCard, styles.primaryAction]}
              onPress={() => router.push("/screens/PullRequestListScreen")}
            >
              <View style={styles.actionIcon}>
                <Github width={28} height={28} color="#ffffff" />
              </View>
              <Text style={styles.actionTitle}>View All PRs</Text>
              <Text style={styles.actionSubtitle}>See all pending reviews</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, styles.secondaryAction]}
              onPress={() => router.push("/screens/SigninScreen")}
            >
              <View style={styles.actionIcon}>
                <Plus width={28} height={28} color="#374151" />
              </View>
              <Text style={[styles.actionTitle, styles.secondaryTitle]}>
                Connect Repo
              </Text>
              <Text style={[styles.actionSubtitle, styles.secondarySubtitle]}>
                Add new repository
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {shouldShowHomeTour && (
        <TourOverlay
          stepIndex={1}
          totalSteps={3}
          title="Your review dashboard"
          description="This is your personalized dashboard. Here you can see recent AI reviews, quick stats, and access all your repositories."
          onPrimary={() => {
            setTourStep("prList");
            router.push("/screens/PullRequestListScreen");
          }}
          onSecondary={() => {
            void completeGuidedTour();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#6366f1",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryStat: {
    backgroundColor: "#6366f1",
  },
  secondaryStat: {
    backgroundColor: "#10b981",
  },
  statIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  statContent: {
    marginTop: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  sectionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
  },
  sectionButtonText: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "700",
  },
  loaderContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryAction: {
    backgroundColor: "#6366f1",
  },
  secondaryAction: {
    backgroundColor: "#f3f4f6",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
    textAlign: "center",
  },
  actionSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  secondaryTitle: {
    color: "#374151",
  },
  secondarySubtitle: {
    color: "#6b7280",
  },
});
