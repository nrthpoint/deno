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

  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  console.log(
    'Sorted Workouts:',
    sortedWorkouts.forEach((w) => console.log(w.startDate, w.duration, w.totalDistance)),
  );

  const progressionPoints: ProgressionEntry[] = [];
  let currentBest = sortedWorkouts[0];

  // Add first workout as baseline
  progressionPoints.push({
    date: formatDate(currentBest.startDate),
    value: formatDuration(currentBest.duration),
    isImprovement: true,
  });

  // Find subsequent improvements
  for (let i = 1; i < sortedWorkouts.length; i++) {
    const workout = sortedWorkouts[i];

    // This ignores slower times that are not improvements.
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

  console.log(
    'Sorted Workouts:',
    sortedWorkouts.forEach((w) => console.log(w.startDate, w.totalDistance)),
  );

  const progressionPoints: ProgressionEntry[] = [];
  let currentBestDistance = 0;

  // Track the furthest distance achieved at this pace level
  for (const workout of sortedWorkouts) {
    const workoutDistance = workout.totalDistance.quantity;

    // Only add entry if this is a new personal best distance at this pace
    if (workoutDistance > currentBestDistance) {
      progressionPoints.push({
        date: formatDate(new Date(workout.startDate)),
        value: `${workoutDistance.toFixed(1)} ${workout.totalDistance.unit}`,
        isImprovement: true,
      });

      currentBestDistance = workoutDistance;
    }
  }

  return progressionPoints.slice(-8); // Show last 8 distance improvements
};

export const generateProgressionData = (group: Group, groupType: GroupType): ProgressionData => {
  switch (groupType) {
    case 'distance':
      return {
        title: 'Progression',
        description: `Your fastest times for ${group.prettyName} over time`,
        entries: getPersonalBestProgression(group.runs),
        metricLabel: 'Time',
      };

    case 'pace':
      return {
        title: 'Progression',
        description: `Total distance covered at ${group.prettyName} pace over time`,
        entries: getTotalDistanceProgression(group.runs),
        metricLabel: 'Distance',
      };

    case 'duration':
      return {
        title: 'Progression',
        description: `Distance covered in ${group.prettyName} sessions over time`,
        entries: getTotalDistanceProgression(group.runs),
        metricLabel: 'Distance',
      };

    case 'elevation':
      return {
        title: 'Progression',
        description: `Elevation achievements for ${group.prettyName} workouts`,
        entries: getTotalDistanceProgression(group.runs),
        metricLabel: 'Distance',
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
