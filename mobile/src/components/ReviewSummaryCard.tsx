/**
 * Review summary card component
 * Displays key information about an AI review
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDistanceToNow } from 'date-fns';

interface ReviewSummaryCardProps {
  review: {
    id: string;
    summary: string;
    overallScore: number;
    createdAt: string;
    pullRequest: {
      title: string;
      repository: {
        fullName: string;
      };
    };
    findings: Array<{
      severity: string;
      category: string;
    }>;
  };
  onPress: () => void;
}

export function ReviewSummaryCard({ review, onPress }: ReviewSummaryCardProps) {
  const criticalCount = review.findings.filter((f) => f.severity === 'critical').length;
  const highCount = review.findings.filter((f) => f.severity === 'high').length;
  const totalFindings = review.findings.length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.repoInfo}>
          <Text style={styles.repoName}>{review.pullRequest.repository.fullName}</Text>
          <Text style={styles.prTitle} numberOfLines={1}>
            {review.pullRequest.title}
          </Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(review.overallScore) }]}>
          <Text style={styles.scoreText}>{review.overallScore}</Text>
        </View>
      </View>

      <Text style={styles.summary} numberOfLines={2}>
        {review.summary}
      </Text>

      <View style={styles.footer}>
        <View style={styles.findings}>
          {criticalCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeTextCritical}>{criticalCount} critical</Text>
            </View>
          )}
          {highCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeTextHigh}>{highCount} high</Text>
            </View>
          )}
          {totalFindings > 0 && (
            <Text style={styles.totalFindings}>{totalFindings} issues found</Text>
          )}
        </View>
        <Text style={styles.timestamp}>
          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  repoInfo: {
    flex: 1,
    marginRight: 12,
  },
  repoName: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  prTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  scoreBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  summary: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  findings: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  badge: {
    marginRight: 8,
  },
  badgeTextCritical: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeTextHigh: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ea580c',
    backgroundColor: '#ffedd5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  totalFindings: {
    fontSize: 12,
    color: '#6b7280',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
