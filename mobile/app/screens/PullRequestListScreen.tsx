/**
 * Pull Request List Screen
 * Shows all reviews with filtering options
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../src/services/apiClient";
import { ReviewSummaryCard } from "../../src/components/ReviewSummaryCard";
import { TourOverlay } from "../../src/onboarding/TourOverlay";
import { useOnboardingContext } from "../../src/contexts/OnboardingContext";

export default function PullRequestListScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "critical" | "high">("all");
  const { isTourActive, currentTourStep, setTourStep, completeGuidedTour } =
    useOnboardingContext();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["reviews", "list", filter],
    queryFn: () =>
      apiClient.getReviews({
        limit: 50,
        severity: filter !== "all" ? filter : undefined,
      }),
  });

  const shouldShowListTour = isTourActive && currentTourStep === "prList";

  return (
    <View style={styles.container}>
      {/* Filter tabs */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "critical" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("critical")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "critical" && styles.filterTextActive,
            ]}
          >
            Critical
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "high" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("high")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "high" && styles.filterTextActive,
            ]}
          >
            High
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reviews list */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#6366f1" style={styles.loader} />
      ) : (
        <FlatList
          data={data?.reviews || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReviewSummaryCard
              review={item}
              onPress={() =>
                router.push(`/screens/PullRequestDetailScreen?id=${item.id}`)
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No reviews found</Text>
            </View>
          }
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}

      {shouldShowListTour && (
        <TourOverlay
          stepIndex={2}
          totalSteps={3}
          title="Filter important pull requests"
          description="Use these filters to zero in on critical or high-severity reviews first. This helps you prioritize your attention."
          onPrimary={() => {
            setTourStep("reviewDetail");
            // We don't know which PR the user will open, so we simply guide them.
            // The next screen will show the final step when a review is opened.
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
    backgroundColor: "#f5f5f5",
  },
  filters: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  filterButtonActive: {
    backgroundColor: "#6366f1",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  filterTextActive: {
    color: "#fff",
  },
  listContent: {
    padding: 16,
  },
  loader: {
    marginTop: 48,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
  },
});
