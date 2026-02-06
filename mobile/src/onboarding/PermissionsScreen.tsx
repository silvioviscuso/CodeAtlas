import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export const PermissionsScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stay notified at the right time</Text>
      <Text style={styles.subtitle}>
        CodeAtlas uses notifications to alert you when AI reviews are ready or when there are
        high-severity issues in your pull requests.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>We recommend enabling:</Text>
        <Text style={styles.cardText}>
          - Review completed alerts
          {'\n'}- High / critical severity findings
          {'\n'}- Daily digest (optional)
        </Text>
      </View>

      <Text style={styles.note}>
        You can always change your notification preferences later from Settings.
      </Text>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/onboarding/GetStarted')}
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
  note: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 12,
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

