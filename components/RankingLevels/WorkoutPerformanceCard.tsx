import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LengthUnit } from '@kingstinct/react-native-healthkit';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useSettings } from '@/context/SettingsContext';
import { useRanking } from '@/hooks/useRanking';
import { Ranking } from '@/services/rankingService/types';
import { getLevelColor, getRankingIcon } from '@/services/rankingService/utils';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { formatPace } from '@/utils/pace';
import { uppercase } from '@/utils/text';

interface WorkoutPerformanceCardProps {
  // Direct props (legacy)
  distance?: number;
  unit?: LengthUnit;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  time?: number;
  // New props for workout-based usage
  workout?: ExtendedWorkout;
  onPress?: (ranking: Ranking) => void;
}

export const WorkoutPerformanceCard: React.FC<WorkoutPerformanceCardProps> = ({
  distance: propDistance,
  unit: propUnit,
  age: propAge,
  gender: propGender,
  time: propTime,
  workout,
  onPress,
}) => {
  const { age: settingsAge, gender: settingsGender, distanceUnit } = useSettings();

  // Determine values - use direct props if provided, otherwise extract from workout
  const distance = propDistance ?? workout?.distance?.quantity ?? 0;
  const unit = propUnit ?? distanceUnit;
  const age = propAge ?? settingsAge ?? 0;
  const gender = propGender ?? settingsGender ?? 'Male';
  const time = propTime ?? workout?.duration?.quantity ?? 0;

  // Check if we have all required data
  const hasWorkoutData = workout !== undefined;
  const hasRequiredData = distance > 0 && time > 0 && age > 0;

  // Always call the hook, but with default values if needed
  const {
    data: ranking,
    isLoading,
    error,
  } = useRanking({
    distance: hasRequiredData ? distance : 1, // Use fallback values to satisfy hook
    unit,
    age: hasRequiredData ? age : 1,
    gender: hasRequiredData ? gender : 'Male',
    time: hasRequiredData ? time : 1,
  });

  // Show no workout message if no workout provided and no direct props
  if (!hasWorkoutData && !propDistance) {
    return (
      <View>
        <Text style={styles.noDataText}>No highlighted workout available</Text>
      </View>
    );
  }

  // Show settings message if we don't have required user data
  if (!hasRequiredData) {
    return (
      <View>
        <Text style={styles.noDataText}>Set your age and gender in settings to see ranking</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <Card style={styles.loadingCard}>
        <View style={styles.cardContent}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />
            <Text style={styles.loadingText}>Loading your performance...</Text>
          </View>
        </View>
      </Card>
    );
  }

  if (error || !ranking) {
    return (
      <Card style={styles.errorCard}>
        <View style={styles.cardContent}>
          <Text style={styles.errorText}>
            {error?.message || 'Unable to load your performance data'}
          </Text>
        </View>
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
      <Card
        style={{
          ...styles.yourPerformanceCard,
          backgroundColor: `${getLevelColor(ranking.level)}${Math.round(
            /*getLevelIntensity(ranking.level) */ 1 * 255,
          )
            .toString(16)
            .padStart(2, '0')}`,
          borderColor: getLevelColor(ranking.level),
        }}
      >
        <View style={styles.cardContent}>
          <View style={styles.performanceContainer}>
            <View style={styles.performanceInfo}>
              <Text style={styles.levelText}>{ranking.level}</Text>
              <Text style={styles.rankText}>{formatPace(ranking.averagePace)}</Text>
              {/* <Text style={styles.rankText}>RANK #{ranking.rank}</Text>
              <Text style={styles.percentileText}>
                Top {(100 - ranking.betterThanPercent).toFixed(1)}%
              </Text> */}
            </View>
            <MaterialCommunityIcons
              name={getRankingIcon(ranking.level)}
              size={38}
              color={colors.background}
              style={styles.performanceIcon}
            />
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  yourPerformanceCard: {
    borderWidth: 2,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingCard: {
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  errorCard: {
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    opacity: 0.7,
    paddingVertical: 20,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
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
  performanceContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  performanceInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  levelText: {
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 4,
  },
  rankText: {
    ...uppercase,
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 6,
  },
  /*   percentileText: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.background,
    opacity: 0.8,
  }, */
  performanceIcon: {
    marginRight: 4,
  },
});
