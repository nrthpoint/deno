import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Simple badge for achievements in a list, with a colored background and label.
 * @param label The achievement label
 * @param color The background color
 */

export type AchievementType =
  | 'All-Time Fastest'
  | 'All-Time Longest'
  | 'All-Time Furthest'
  | 'Highest Elevation';

export interface AchievementListBadgeProps {
  label: AchievementType | string;
  color?: string;
}

function getBackgroundColor(label: string): string {
  switch (label) {
    case 'All-Time Fastest':
      return '#43e97b'; // green
    case 'All-Time Longest':
      return '#2196f3'; // blue
    case 'All-Time Furthest':
      return '#ff9800'; // orange
    case 'Highest Elevation':
      return '#9c27b0'; // purple
    default:
      return '#607d8b'; // grey
  }
}

export const AchievementListBadge: React.FC<AchievementListBadgeProps> = ({ label, color }) => (
  <View style={[styles.badge, { backgroundColor: color || getBackgroundColor(label) }]}>
    <Text style={styles.text}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
