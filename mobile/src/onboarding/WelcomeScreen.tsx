import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

interface Props {
  onSkip?: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onSkip }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Placeholder logo; in production this would use a branded asset */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>CA</Text>
        </View>
        <Text style={styles.title}>Welcome to CodeAtlas</Text>
        <Text style={styles.subtitle}>
          AI-powered code review insights, right in your pocket.
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.bulletTitle}>What you can do:</Text>
        <Text style={styles.bullet}>• Stay on top of pull requests</Text>
        <Text style={styles.bullet}>• See AI review summaries instantly</Text>
        <Text style={styles.bullet}>• Get alerts for high-severity issues</Text>
      </View>

      <View style={styles.footer}>
        {onSkip && (
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/onboarding/FeatureOverview')}
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
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  content: {
    marginTop: 32,
  },
  bulletTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  skipText: {
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

