import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { GroupType } from '@/types/Groups';

/**
 * Extracts the appropriate numeric values from workouts for consistency calculation
 * based on the group type
 *
 * @param workouts - Array of workout samples
 * @param groupType - The type of grouping (pace, distance, duration, elevation, etc.)
 * @returns Array of numeric values to use for consistency calculation
 */
export function extractConsistencyValues(
  workouts: readonly ExtendedWorkout[],
  groupType: GroupType,
): number[] {
  if (workouts.length === 0) {
    return [];
  }

  switch (groupType) {
    case 'pace':
      // For pace groups, measure consistency of distances
      return workouts.map((w) => w.distance.quantity);

    case 'distance':
      // For distance groups, measure consistency of durations
      return workouts.map((w) => w.duration.quantity);

    case 'duration':
      // For duration groups, measure consistency of distances
      return workouts.map((w) => w.distance.quantity);

    case 'elevation':
      // For elevation groups, measure consistency of durations
      return workouts.map((w) => w.duration.quantity);

    case 'temperature':
      // For temperature groups, measure consistency of paces
      return workouts.map((w) => w.pace.quantity);

    case 'humidity':
      // For humidity groups, measure consistency of paces
      return workouts.map((w) => w.pace.quantity);

    default:
      // Default to pace consistency
      return workouts.map((w) => w.pace.quantity);
  }
}

/**
 * Gets a human-readable label for what is being measured for consistency
 *
 * @param groupType - The type of grouping
 * @returns A label describing what metric is being measured for consistency
 */
export function getConsistencyMetricLabel(groupType: GroupType): string {
  switch (groupType) {
    case 'pace':
      return 'Distance';
    case 'distance':
      return 'Duration';
    case 'duration':
      return 'Distance';
    case 'elevation':
      return 'Duration';
    case 'temperature':
      return 'Pace';
    case 'humidity':
      return 'Pace';
    default:
      return 'Pace';
  }
}
