import { ProgressionEntry } from '@/components/ProgressionCard/ProgressionCard';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group, GroupType } from '@/types/Groups';
import { formatDuration } from '@/utils/time';

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

const getPersonalBestProgression = (workouts: ExtendedWorkout[]): ProgressionEntry[] => {
  if (workouts.length === 0) return [];

  // Sort workouts by date
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  const progressionPoints: ProgressionEntry[] = [];
  let currentBest = sortedWorkouts[0];

  // Add first workout as baseline
  progressionPoints.push({
    date: formatDate(new Date(currentBest.startDate)),
    value: formatDuration(currentBest.duration),
    isImprovement: true,
  });

  // Find subsequent improvements
  for (let i = 1; i < sortedWorkouts.length; i++) {
    const workout = sortedWorkouts[i];

    if (workout.duration.quantity < currentBest.duration.quantity) {
      const isImprovement = workout.duration.quantity < currentBest.duration.quantity;

      progressionPoints.push({
        date: formatDate(new Date(workout.startDate)),
        value: formatDuration(workout.duration),
        isImprovement,
      });

      currentBest = workout;
    }
  }

  return progressionPoints;
};

const getTotalDistanceProgression = (workouts: ExtendedWorkout[]): ProgressionEntry[] => {
  if (workouts.length === 0) return [];

  // Sort workouts by date
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  const progressionPoints: ProgressionEntry[] = [];
  let cumulativeDistance = 0;
  let lastSignificantEntry = 0;

  for (const workout of sortedWorkouts) {
    const previousDistance = cumulativeDistance;
    cumulativeDistance += workout.totalDistance.quantity;

    // Only add entry if it's a significant increase (more than 20% or first few entries)
    const isSignificantIncrease =
      progressionPoints.length < 3 ||
      cumulativeDistance - lastSignificantEntry >= lastSignificantEntry * 0.2;

    if (isSignificantIncrease) {
      progressionPoints.push({
        date: formatDate(new Date(workout.startDate)),
        value: `${cumulativeDistance.toFixed(1)} ${workout.totalDistance.unit}`,
        isImprovement: cumulativeDistance > previousDistance,
      });

      lastSignificantEntry = cumulativeDistance;
    }
  }

  return progressionPoints.slice(-8); // Show last 8 significant entries
};

export const generateProgressionData = (group: Group, groupType: GroupType): ProgressionData => {
  switch (groupType) {
    case 'distance':
      return {
        title: 'Progression',
        description: `Your fastest times for ${group.prettyName} over time`,
        entries: getPersonalBestProgression(group.runs),
        metricLabel: 'Best Time',
      };

    case 'pace':
      return {
        title: 'Progression',
        description: `Total distance covered at ${group.prettyName} pace over time`,
        entries: getTotalDistanceProgression(group.runs),
        metricLabel: 'Total Distance',
      };

    case 'duration':
      return {
        title: 'Progression',
        description: `Distance covered in ${group.prettyName} sessions over time`,
        entries: getTotalDistanceProgression(group.runs),
        metricLabel: 'Total Distance',
      };

    case 'elevation':
      return {
        title: 'Progression',
        description: `Elevation achievements for ${group.prettyName} workouts`,
        entries: getTotalDistanceProgression(group.runs),
        metricLabel: 'Total Distance',
      };

    default:
      return {
        title: 'Progression',
        description: 'Track your improvement over time',
        entries: [],
        metricLabel: 'Progress',
      };
  }
};
