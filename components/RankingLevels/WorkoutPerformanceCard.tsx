import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useSettings } from '@/context/SettingsContext';
import { useRanking } from '@/hooks/useRanking';
import { Ranking } from '@/services/rankingService/types';
import { getRankingIcon } from '@/services/rankingService/utils';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { subheading } from '@/utils/text';

interface WorkoutPerformanceCardProps {
  workout: ExtendedWorkout;
  onPress?: (ranking: Ranking) => void;
}

export const WorkoutPerformanceCard: React.FC<WorkoutPerformanceCardProps> = ({
  workout,
  onPress,
}) => {
  const { distanceUnit: unit, age, gender } = useSettings();

  const distance = workout.distance.quantity;
  const time = workout.duration.quantity;

  const {
    data: ranking,
    isLoading,
    error,
  } = useRanking({
    distance,
    unit,
    age,
    gender,
    time,
  });

  if (isLoading) {
    return (
      <Card style={styles.loadingCard}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={colors.primary}
          />
          <Text style={styles.loadingText}>Loading your performance...</Text>
        </View>
      </Card>
    );
  }

  if (error || !ranking) {
    return (
      <Card style={styles.errorCard}>
        <Text style={styles.errorText}>
          {error?.message || 'Unable to load your performance data'}
        </Text>
      </Card>
    );
  }

  const handlePress = () => {
    if (onPress && ranking) {
      onPress(ranking);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <Card style={styles.yourPerformanceCard}>
        <View style={styles.performanceInfo}>
          <MaterialCommunityIcons
            name={getRankingIcon(ranking.level)}
            size={24}
            color={colors.background}
            style={styles.performanceIcon}
          />
          <Text style={styles.levelText}>{ranking.level}</Text>
          <Text style={styles.subheading}>Rank</Text>
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  yourPerformanceCard: {
    backgroundColor: 'transparent',
    color: colors.neutral,
    paddingVertical: 16,
  },
  loadingCard: {},
  errorCard: {},
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    opacity: 0.7,
  },
  errorText: {
    marginVertical: 10,
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    textAlign: 'center',
  },
  performanceInfo: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 4,
  },
  performanceIcon: {
    marginBottom: 14,
    backgroundColor: colors.neutral,
    borderRadius: '50%',
    padding: 12,
  },
  subheading: {
    ...subheading,
    marginTop: 5,
    fontFamily: LatoFonts.light,
  },
});
