import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export const FeatureOverviewScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stay ahead of your codebase</Text>
      <Text style={styles.subtitle}>
        CodeAtlas keeps you in the loop with smart, AI-powered insights.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>PR notifications</Text>
        <Text style={styles.cardText}>
          Get notified when new pull requests are opened or when AI reviews finish.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>AI review summaries</Text>
        <Text style={styles.cardText}>
          Quickly scan readability, security, performance, and maintainability signals.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Actionable alerts</Text>
        <Text style={styles.cardText}>
          Focus on what matters first: critical and high-severity findings across your repos.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/onboarding/GitHubConnect')}
        >
          <Text style={styles.primaryText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  secondaryText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

