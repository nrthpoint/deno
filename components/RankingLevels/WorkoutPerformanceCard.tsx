import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
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
      <Pressable onPress={() => router.push('/(tabs)/settings')}>
        <Card style={styles.yourPerformanceCard}>
          <View style={styles.performanceInfo}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={24}
              color={colors.neutral}
              style={styles.performanceIcon}
            />
            <Text style={styles.levelText}>{error?.message || 'Unable to load'}</Text>
            {/*             <Text style={styles.subheading}>Tap to update settings</Text>
             */}
          </View>
        </Card>
      </Pressable>
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingLeft: 10,
  },
  performanceInfo: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  levelText: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'center',
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
    textAlign: 'center',
  },
});
