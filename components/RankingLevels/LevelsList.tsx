import { LengthUnit } from '@kingstinct/react-native-healthkit';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useLevels } from '@/hooks/useLevels';
import { useRanking } from '@/hooks/useRanking';

import { LevelsBarChart } from './LevelsBarChart';

interface LevelsListProps {
  distance: number;
  unit: LengthUnit;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  time: number;
}

export const LevelsList: React.FC<LevelsListProps> = ({ distance, unit, age, gender, time }) => {
  const {
    data: levels,
    isLoading: levelsLoading,
    error: levelsError,
  } = useLevels({
    distance,
    unit,
    age,
    gender,
  });

  // Get user's ranking data to show their pace on the chart
  const {
    data: ranking,
    isLoading: rankingLoading,
    error: rankingError,
  } = useRanking({
    distance,
    unit,
    age,
    gender,
    time,
  });

  const loading = levelsLoading || rankingLoading;
  const error = levelsError || rankingError;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
        <Text style={styles.loadingText}>Loading performance levels...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <Card style={styles.errorCard}>
        <View style={styles.cardContent}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      </Card>
    );
  }

  if (!levels) {
    return null;
  }

  return (
    <View style={styles.levelsContainer}>
      {/* Vertical Bar Chart */}
      <LevelsBarChart
        levels={levels.levels}
        userPace={ranking?.yourPace}
        height={600}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  levelsContainer: {
    gap: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    opacity: 0.7,
  },
  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  errorText: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    textAlign: 'center',
  },
});
