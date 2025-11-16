import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/config/colors';
import { getLatoFont } from '@/config/fonts';
import { useGroupStats } from '@/context/GroupStatsContext';
import { useWorkout } from '@/context/Workout';
import { getConsistencyMetricLabel } from '@/grouping-engine/services/consistencyValueExtractor';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { formatDistance } from '@/utils/distance';
import { formatPace } from '@/utils/pace';
import { uppercase } from '@/utils/text';
import { formatDuration } from '@/utils/time';

interface WorkoutRowProps {
  workout: ExtendedWorkout;
  label: string;
  value: string;
  onPress: () => void;
}

const WorkoutRow: React.FC<WorkoutRowProps> = ({ workout, label, value, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.workoutRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutLabel}>{label}</Text>
        <Text style={styles.workoutDate}>{workout.daysAgo}</Text>
      </View>
      <View style={styles.workoutValue}>
        <Text style={styles.workoutValueText}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const ConsistencyModalContent: React.FC = () => {
  const { group } = useGroupStats();
  const { setSelectedWorkouts } = useWorkout();

  // Find the workouts with lowest and highest variation from the mean
  const { lowestVariation, highestVariation } = useMemo(() => {
    if (!group || group.runs.length === 0) {
      return { lowestVariation: null, highestVariation: null };
    }

    const mean = group.consistencyMean;
    const workoutsWithVariation = group.runs.map((workout) => {
      let value: number;
      switch (group.type) {
        case 'pace':
          value = workout.distance.quantity;
          break;
        case 'distance':
        case 'elevation':
          value = workout.duration.quantity;
          break;
        case 'duration':
          value = workout.distance.quantity;
          break;
        case 'temperature':
        case 'humidity':
          value = workout.pace.quantity;
          break;
        default:
          value = workout.pace.quantity;
      }

      return {
        workout,
        value,
        deviation: Math.abs(value - mean),
      };
    });

    workoutsWithVariation.sort((a, b) => a.deviation - b.deviation);

    return {
      lowestVariation: workoutsWithVariation[0]?.workout || null,
      highestVariation: workoutsWithVariation[workoutsWithVariation.length - 1]?.workout || null,
    };
  }, [group]);

  if (!group) {
    return null;
  }

  const metricLabel = getConsistencyMetricLabel(group.type);

  const handleWorkoutPress = (workout: ExtendedWorkout) => {
    setSelectedWorkouts([workout]);
    router.push('/view-workout');
  };

  const formatValue = (workout: ExtendedWorkout): string => {
    switch (group.type) {
      case 'pace':
        return formatDistance(workout.distance);
      case 'distance':
      case 'elevation':
        return formatDuration(workout.duration);
      case 'duration':
        return formatDistance(workout.distance);
      case 'temperature':
      case 'humidity':
        return formatPace(workout.pace);
      default:
        return formatPace(workout.pace);
    }
  };

  const formatStatValue = (value: number): string => {
    switch (group.type) {
      case 'pace':
        return `${value.toFixed(2)} mi`;
      case 'distance':
      case 'elevation':
        return formatDuration({ quantity: value, unit: 's' });
      case 'duration':
        return `${value.toFixed(2)} mi`;
      case 'temperature':
      case 'humidity':
        return `${value.toFixed(2)} min/mi`;
      default:
        return value.toFixed(2);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Consistency measures how similar your workouts are in this group. Higher scores mean more
        predictable {metricLabel.toLowerCase()} values.
      </Text>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Mean {metricLabel}</Text>
          <Text style={styles.statValue}>{formatStatValue(group.consistencyMean)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Median {metricLabel}</Text>
          <Text style={styles.statValue}>{formatStatValue(group.consistencyMedian)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Standard Deviation</Text>
          <Text style={styles.statValue}>
            {formatStatValue(group.consistencyStandardDeviation)}
          </Text>
        </View>
      </View>

      <View style={styles.workoutsSection}>
        <Text style={styles.sectionTitle}>Example Workouts</Text>

        {lowestVariation && (
          <WorkoutRow
            workout={lowestVariation}
            label="Most Consistent Run"
            value={formatValue(lowestVariation)}
            onPress={() => handleWorkoutPress(lowestVariation)}
          />
        )}

        {highestVariation && (
          <WorkoutRow
            workout={highestVariation}
            label="Least Consistent Run"
            value={formatValue(highestVariation)}
            onPress={() => handleWorkoutPress(highestVariation)}
          />
        )}
      </View>

      <Text style={styles.tapHint}>Tap on a workout to view details</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  description: {
    fontSize: 14,
    fontFamily: getLatoFont('regular'),
    color: colors.lightGray,
    marginBottom: 24,
    lineHeight: 20,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...uppercase,
    fontSize: 12,
    fontFamily: getLatoFont('bold'),
    color: colors.neutral,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: getLatoFont('regular'),
    color: colors.lightGray,
  },
  statValue: {
    fontSize: 14,
    fontFamily: getLatoFont('bold'),
    color: colors.neutral,
  },
  workoutsSection: {
    marginBottom: 16,
  },
  workoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutLabel: {
    fontSize: 13,
    fontFamily: getLatoFont('bold'),
    color: colors.neutral,
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 11,
    fontFamily: getLatoFont('regular'),
    color: colors.lightGray,
  },
  workoutValue: {
    marginLeft: 16,
  },
  workoutValueText: {
    fontSize: 16,
    fontFamily: getLatoFont('bold'),
    color: colors.primary,
  },
  tapHint: {
    fontSize: 11,
    fontFamily: getLatoFont('regular'),
    color: colors.lightGray,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
