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
      <Card style={styles.yourPerformanceCard}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={colors.neutral}
          />
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
            color={colors.neutral}
            style={[styles.performanceIcon /*, { backgroundColor: getLevelColor(ranking.level) }*/]}
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
  },
  errorCard: {
    backgroundColor: 'transparent',
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingLeft: 10,
  },
  errorText: {
    marginVertical: 10,
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    textAlign: 'center',
    lineHeight: 18,
  },
  performanceInfo: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  levelText: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginTop: 4,
    marginBottom: 4,
  },
  performanceIcon: {
    marginBottom: 14,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.background,
  },
  subheading: {
    ...subheading,
    marginBottom: 0,
    marginTop: 5,
    fontFamily: LatoFonts.regular,
    color: colors.background,
  },
});
