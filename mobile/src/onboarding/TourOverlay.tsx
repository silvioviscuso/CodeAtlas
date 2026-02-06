/**
 * Guided tour overlay
 *
 * Lightweight custom implementation instead of a heavy third-party library.
 * Trade-offs:
 * - Pros: No native linking, predictable styling, easy theming.
 * - Cons: Does not draw precise \"spotlight\" around components; instead
 *   uses contextual overlays anchored to the bottom of the screen.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface TourOverlayProps {
  stepIndex: number;
  totalSteps: number;
  title: string;
  description: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
}

export const TourOverlay: React.FC<TourOverlayProps> = ({
  stepIndex,
  totalSteps,
  title,
  description,
  primaryLabel = 'Next',
  secondaryLabel = 'Skip',
  onPrimary,
  onSecondary,
}) => {
  return (
    <View style={styles.backdrop}>
      <View style={styles.bottomSheet}>
        <View style={styles.headerRow}>
          <Text style={styles.stepText}>
            Step {stepIndex} of {totalSteps}
          </Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.actionsRow}>
          {onSecondary && (
            <TouchableOpacity style={styles.secondaryButton} onPress={onSecondary}>
              <Text style={styles.secondaryText}>{secondaryLabel}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.primaryButton} onPress={onPrimary}>
            <Text style={styles.primaryText}>{primaryLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  secondaryText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  primaryText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

