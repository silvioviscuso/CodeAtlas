/**
 * Pull Request Detail Screen
 * Shows full review details with findings breakdown
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../src/services/apiClient";
import { formatDistanceToNow } from "date-fns";
import { TourOverlay } from "../../src/onboarding/TourOverlay";
import { useOnboardingContext } from "../../src/contexts/OnboardingContext";

export default function PullRequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isTourActive, currentTourStep, completeGuidedTour } =
    useOnboardingContext();

  const { data: review, isLoading } = useQuery({
    queryKey: ["review", id],
    queryFn: () => apiClient.getReviewById(id!),
    enabled: !!id,
  });

  if (isLoading || !review) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const findingsByCategory = review.findings.reduce(
    (acc: any, finding: any) => {
      if (!acc[finding.category]) {
        acc[finding.category] = [];
      }
      acc[finding.category].push(finding);
      return acc;
    },
    {},
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#dc2626";
      case "high":
        return "#ea580c";
      case "medium":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const shouldShowDetailTour =
    isTourActive && currentTourStep === "reviewDetail";

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.repoName}>
            {review.pullRequest.repository.fullName}
          </Text>
          <Text style={styles.prTitle}>{review.pullRequest.title}</Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
              })}
            </Text>
            <View style={[styles.scoreBadge, { backgroundColor: "#6366f1" }]}>
              <Text style={styles.scoreText}>Score: {review.overallScore}</Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{review.summary}</Text>
        </View>

        {/* Findings by category */}
        {Object.entries(findingsByCategory).map(
          ([category, findings]: [string, any]) => (
            <View key={category} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1)} (
                {findings.length})
              </Text>
              {findings.map((finding: any, index: number) => (
                <View key={index} style={styles.finding}>
                  <View style={styles.findingHeader}>
                    <View
                      style={[
                        styles.severityBadge,
                        { backgroundColor: getSeverityColor(finding.severity) },
                      ]}
                    >
                      <Text style={styles.severityText}>
                        {finding.severity}
                      </Text>
                    </View>
                    {finding.filePath && (
                      <Text style={styles.filePath}>{finding.filePath}</Text>
                    )}
                  </View>
                  <Text style={styles.findingTitle}>{finding.title}</Text>
                  <Text style={styles.findingDescription}>
                    {finding.description}
                  </Text>
                  {finding.suggestion && (
                    <View style={styles.suggestion}>
                      <Text style={styles.suggestionLabel}>Suggestion:</Text>
                      <Text style={styles.suggestionText}>
                        {finding.suggestion}
                      </Text>
                    </View>
                  )}
                  {finding.codeSnippet && (
                    <View style={styles.codeBlock}>
                      <Text style={styles.codeText}>{finding.codeSnippet}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ),
        )}

        {/* Actions */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // In production, open GitHub PR URL (could deep-link into specific PR)
            Linking.openURL(
              `https://github.com/${review.pullRequest.repository.fullName}`,
            );
          }}
        >
          <Text style={styles.actionButtonText}>View on GitHub</Text>
        </TouchableOpacity>
      </ScrollView>

      {shouldShowDetailTour && (
        <TourOverlay
          stepIndex={3}
          totalSteps={3}
          title="Dive into actionable insights"
          description="Here you’ll see AI findings grouped by category with severity, suggestions, and code snippets. Use this view to review and triage issues quickly."
          primaryLabel="Finish tour"
          onPrimary={() => {
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
  content: {
    padding: 16,
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  repoName: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  prTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  scoreText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
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
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 22,
  },
  finding: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  findingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  severityText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  filePath: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "monospace",
  },
  findingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  findingDescription: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
    marginBottom: 8,
  },
  suggestion: {
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0369a1",
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: "#0c4a6e",
  },
  codeBlock: {
    backgroundColor: "#1f2937",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  codeText: {
    color: "#f9fafb",
    fontFamily: "monospace",
    fontSize: 12,
  },
  actionButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
