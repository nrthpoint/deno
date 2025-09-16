import { Quantity } from '@kingstinct/react-native-healthkit';

import { ProgressionEntry } from '@/components/ProgressionCard/ProgressionCard';
import { TimeRange } from '@/config/timeRanges';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group, GroupType } from '@/types/Groups';
import { formatDuration } from '@/utils/time';
import { generateTimeLabel } from '@/utils/timeLabels';

interface ProgressionData {
  title: string;
  description: string;
  entries: ProgressionEntry[];
  metricLabel: string;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const sortWorkoutsByDate = (workouts: ExtendedWorkout[]): ExtendedWorkout[] => {
  return [...workouts].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
};

interface ProgressionConfig<T> {
  getValue: (workout: ExtendedWorkout) => T;
  getFullQuantity: (workout: ExtendedWorkout) => Quantity;
  formatValue: (value: T) => string;
  isImprovement: (current: T, best: T) => boolean;
  limit?: number;
}

const createProgressionEntries = <T>(
  workouts: ExtendedWorkout[],
  config: ProgressionConfig<T>,
): ProgressionEntry[] => {
  if (workouts.length === 0) return [];

  const sortedWorkouts = sortWorkoutsByDate(workouts);
  const progressionPoints: ProgressionEntry[] = [];
  let currentBest = config.getValue(sortedWorkouts[0]);

  // Add first workout as baseline
  progressionPoints.push({
    date: formatDate(sortedWorkouts[0].startDate),
    value: config.formatValue(currentBest),
    fullQuantity: config.getFullQuantity(sortedWorkouts[0]),
    isImprovement: true,
  });

  // Find subsequent improvements
  for (let i = 1; i < sortedWorkouts.length; i++) {
    const workout = sortedWorkouts[i];
    const workoutValue = config.getValue(workout);

    if (config.isImprovement(workoutValue, currentBest)) {
      progressionPoints.push({
        date: formatDate(new Date(workout.startDate)),
        value: config.formatValue(workoutValue),
        fullQuantity: config.getFullQuantity(workout),
        isImprovement: true,
      });

      currentBest = workoutValue;
    }
  }

  return config.limit ? progressionPoints.slice(-config.limit) : progressionPoints;
};

const getPersonalBestProgression = (workouts: ExtendedWorkout[]): ProgressionEntry[] => {
  return createProgressionEntries(workouts, {
    getValue: (workout) => workout.duration.quantity,
    getFullQuantity: (workout) => workout.duration,
    formatValue: (value) => formatDuration({ quantity: value, unit: 's' }),
    isImprovement: (current, best) => current < best,
  });
};

const getTotalDistanceProgression = (workouts: ExtendedWorkout[]): ProgressionEntry[] => {
  return createProgressionEntries(workouts, {
    getValue: (workout) => workout.totalDistance.quantity,
    getFullQuantity: (workout) => workout.totalDistance,
    formatValue: (value) => {
      const unit = workouts[0]?.totalDistance.unit || 'km';
      return `${value.toFixed(1)} ${unit}`;
    },
    isImprovement: (current, best) => current > best,
    limit: 8,
  });
};

export const generateProgressionData = (
  group: Group,
  groupType: GroupType,
  timeRangeInDays: TimeRange,
): ProgressionData => {
  const timeLabel = generateTimeLabel(timeRangeInDays);

  switch (groupType) {
    case 'distance':
      return {
        title: 'Progression',
        description: `Your fastest times for ${group.prettyName} ${timeLabel}`,
        entries: getPersonalBestProgression(group.runs),
        metricLabel: 'Time',
      };

    case 'pace':
      return {
        title: 'Progression',
        description: `Total distance covered at ${group.prettyName} pace ${timeLabel}`,
        entries: getTotalDistanceProgression(group.runs),
        metricLabel: 'Distance',
      };

    case 'duration':
      return {
        title: 'Progression',
        description: `Distance covered in ${group.prettyName} sessions ${timeLabel}`,
        entries: getTotalDistanceProgression(group.runs),
        metricLabel: 'Distance',
      };

    case 'elevation':
      return {
        title: 'Progression',
        description: `Elevation achievements for ${group.prettyName} sessions ${timeLabel}`,
        entries: getTotalDistanceProgression(group.runs),
        metricLabel: 'Distance',
      };

    default:
      return {
        title: 'Progression',
        description: `Track your improvement over ${timeLabel}`,
        entries: [],
        metricLabel: 'Progress',
      };
  }
};
