import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { Ranking } from '@/services/rankingService/types';

interface ComparisonHeaderProps {
  userDistance: number;
  ranking?: Ranking;
  unit: string;
}

export const ComparisonHeader: React.FC<ComparisonHeaderProps> = ({
  userDistance,
  ranking,
  unit,
}) => {
  const formatDistance = (distance: number, unit: string): string => {
    return `${distance.toFixed(2)} ${unit}`;
  };

  const formatDistanceDifference = (difference: number, unit: string): string => {
    const absValue = Math.abs(difference);
    const sign = difference > 0 ? '+' : '';
    return `${sign}${absValue.toFixed(2)} ${unit}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Performance Comparison</Text>
      <Text style={styles.subtitle}>
        Comparing your fastest {formatDistance(userDistance, unit)} workout against performance
        standards for the nearest available distance from our database.
      </Text>

      {ranking?.distanceDifference && (
        <View style={styles.differenceContainer}>
          <Text style={styles.differenceLabel}>Distance Difference:</Text>
          <Text style={styles.differenceValue}>
            {formatDistanceDifference(
              ranking.distanceDifference.quantity,
              ranking.distanceDifference.unit,
            )}
          </Text>
          <Text style={styles.differenceExplanation}>
            {ranking.distanceDifference.quantity > 0
              ? 'Database distance is longer than your workout'
              : ranking.distanceDifference.quantity < 0
                ? 'Database distance is shorter than your workout'
                : 'Exact distance match found'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  heading: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 12,
  },
  differenceContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  differenceLabel: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    opacity: 0.7,
    marginBottom: 4,
  },
  differenceValue: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.primary,
    marginBottom: 4,
  },
  differenceExplanation: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    opacity: 0.6,
    fontStyle: 'italic',
  },
});
