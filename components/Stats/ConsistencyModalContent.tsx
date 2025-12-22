import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  // For consistency display, show the actual best/worst workouts from the group
  // which represent the extremes of the consistency metric being measured
  const { lowestVariation, highestVariation } = useMemo(() => {
    if (!group || group.runs.length === 0) {
      return { lowestVariation: null, highestVariation: null };
    }

    // Use the group's highlight (best) and worst properties
    // which already represent the extremes of the metric being measured
    return {
      lowestVariation: group.highlight,
      highestVariation: group.worst,
    };
  }, [group]);

  if (!group) {
    return null;
  }

  const metricLabel = getConsistencyMetricLabel(group.type);

  // Get detailed explanation for what is being measured
  const getConsistencyExplanation = (): string => {
    switch (group.type) {
      case 'pace':
        return 'For pace groups, consistency measures how similar the distances are across your runs. A high consistency score means you consistently run similar distances at this pace.';
      case 'distance':
        return 'For distance groups, consistency measures how similar the durations are across your runs. A high consistency score means you consistently take a similar amount of time to complete this distance.';
      case 'duration':
        return 'For duration groups, consistency measures how similar the distances are across your runs. A high consistency score means you consistently cover similar distances in this time period.';
      case 'elevation':
        return 'For elevation groups, consistency measures how similar the durations are across your runs. A high consistency score means you consistently take a similar amount of time at this elevation gain.';
      case 'temperature':
        return 'For temperature groups, consistency measures how similar your paces are across your runs. A high consistency score means you consistently maintain similar paces at this temperature.';
      case 'humidity':
        return 'For humidity groups, consistency measures how similar your paces are across your runs. A high consistency score means you consistently maintain similar paces at this humidity level.';
      default:
        return 'Consistency measures how similar your workouts are in this group. Higher scores mean more predictable performance.';
    }
  };

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

  const getSampleLabels = (): { lowest: string; highest: string } => {
    switch (group.type) {
      case 'pace':
        return { lowest: 'Shortest Run', highest: 'Longest Run' };
      case 'distance':
      case 'elevation':
        return { lowest: 'Fastest Run', highest: 'Slowest Run' };
      case 'duration':
        return { lowest: 'Shortest Run', highest: 'Furthest Run' };
      case 'temperature':
      case 'humidity':
        return { lowest: 'Fastest Run', highest: 'Slowest Run' };
      default:
        return { lowest: 'Most Consistent Run', highest: 'Least Consistent Run' };
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.description}>{getConsistencyExplanation()}</Text>

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
          {lowestVariation && (
            <WorkoutRow
              workout={lowestVariation}
              label={getSampleLabels().lowest}
              value={formatValue(lowestVariation)}
              onPress={() => handleWorkoutPress(lowestVariation)}
            />
          )}

          {highestVariation && (
            <WorkoutRow
              workout={highestVariation}
              label={getSampleLabels().highest}
              value={formatValue(highestVariation)}
              onPress={() => handleWorkoutPress(highestVariation)}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: 500,
  },
  container: {
    padding: 0,
  },
  description: {
    ...getLatoFont('regular'),
    fontSize: 14,
    color: colors.neutral,
    marginBottom: 24,
    lineHeight: 22,
  },
  statsSection: {
    borderTopWidth: 1,
    borderTopColor: '#c3c3c31a',
    paddingTop: 24,
    marginBottom: 10,
  },
  sectionTitle: {
    ...uppercase,
    fontSize: 14,
    color: colors.neutral,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  statLabel: {
    ...getLatoFont('regular'),
    fontSize: 13,
    color: colors.lightGray,
  },
  statValue: {
    ...getLatoFont('bold'),
    ...uppercase,
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
    marginTop: 12,
    marginBottom: 8,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutLabel: {
    ...getLatoFont('bold'),
    fontSize: 13,
    color: colors.neutral,
    marginBottom: 4,
  },
  workoutDate: {
    ...getLatoFont('regular'),
    fontSize: 11,
    color: colors.lightGray,
  },
  workoutValue: {},
  workoutValueText: {
    ...uppercase,
    ...getLatoFont('bold'),
    color: colors.neutral,
  },
});
