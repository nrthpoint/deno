import { LengthUnit } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export interface WorkoutSplit {
  splitNumber: number;
  distance: number;
  distanceUnit: LengthUnit;
  duration: number; // seconds
  pace: number; // seconds per unit
  startTime: Date;
  endTime: Date;
  cumulativeDistance: number;
  cumulativeTime: number;
  isWhole: boolean; // true if this is a complete distance unit split (1 mile/km)
}

const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

function convertMetersToUnit(meters: number, unit: LengthUnit): number {
  switch (unit) {
    case 'mi':
      return meters / 1609.34;
    case 'km':
      return meters / 1000;
    case 'm':
      return meters;
    default:
      return meters;
  }
}

function convertUnitToMeters(distance: number, unit: LengthUnit): number {
  switch (unit) {
    case 'mi':
      return distance * 1609.34;
    case 'km':
      return distance * 1000;
    case 'm':
      return distance;
    default:
      return distance;
  }
}

/**
 * Calculates exact distance splits for workouts using GPS data
 * Each split will be exactly the specified distance in the given unit
 */
export async function calculateExactDistanceSplits(
  workouts: ExtendedWorkout[],
  distanceUnit: LengthUnit,
): Promise<Map<string, WorkoutSplit[]>> {
  const splitsByWorkoutId = new Map<string, WorkoutSplit[]>();

  for (const workout of workouts) {
    try {
      const splits = await calculateSplitsForWorkout(workout, distanceUnit);
      splitsByWorkoutId.set(workout.uuid, splits);
    } catch (error) {
      console.warn(`Failed to calculate splits for workout ${workout.uuid}:`, error);
      splitsByWorkoutId.set(workout.uuid, []);
    }
  }

  return splitsByWorkoutId;
}

/**
 * Calculates splits for a single workout
 */
export async function calculateSplitsForWorkout(
  workout: ExtendedWorkout,
  distanceUnit: LengthUnit,
): Promise<WorkoutSplit[]> {
  const routes = await workout.proxy.getWorkoutRoutes();
  if (!routes || routes.length === 0 || !routes[0].locations) {
    return [];
  }

  const locations = routes[0].locations;
  if (locations.length < 2) {
    return [];
  }

  const targetSplitMeters = convertUnitToMeters(1, distanceUnit);
  const splits: WorkoutSplit[] = [];

  let cumulativeDistanceMeters = 0;
  let cumulativeTimeSeconds = 0;
  let currentSplitDistanceMeters = 0;
  let splitStartTime = new Date(locations[0].date);

  for (let i = 1; i < locations.length; i++) {
    const prevLocation = locations[i - 1];
    const currentLocation = locations[i];

    const segmentDistanceMeters = calculateDistanceMeters(
      prevLocation.latitude,
      prevLocation.longitude,
      currentLocation.latitude,
      currentLocation.longitude,
    );

    const segmentTimeSeconds =
      (new Date(currentLocation.date).getTime() - new Date(prevLocation.date).getTime()) / 1000;

    cumulativeDistanceMeters += segmentDistanceMeters;
    cumulativeTimeSeconds += segmentTimeSeconds;
    currentSplitDistanceMeters += segmentDistanceMeters;

    // Check if we've reached or exceeded the target split distance
    if (
      currentSplitDistanceMeters >= targetSplitMeters ||
      i === locations.length - 1 // Last location, complete the final split
    ) {
      // Calculate split end time based on distance interpolation if we overshot
      let splitEndTime = new Date(currentLocation.date);
      let actualSplitDistanceMeters = currentSplitDistanceMeters;

      // If we overshot the target distance, interpolate the end time
      if (currentSplitDistanceMeters > targetSplitMeters && i < locations.length - 1) {
        const overshoot = currentSplitDistanceMeters - targetSplitMeters;
        const overshootRatio = overshoot / segmentDistanceMeters;
        const interpolatedTimeMs = segmentTimeSeconds * overshootRatio * 1000;

        splitEndTime = new Date(currentLocation.date.getTime() - interpolatedTimeMs);
        actualSplitDistanceMeters = targetSplitMeters;

        // Adjust cumulative values to account for the exact split distance
        cumulativeDistanceMeters -= overshoot;
        cumulativeTimeSeconds -= segmentTimeSeconds * overshootRatio;
      }

      const splitDurationSeconds = (splitEndTime.getTime() - splitStartTime.getTime()) / 1000;
      const splitDistanceInUnit = convertMetersToUnit(actualSplitDistanceMeters, distanceUnit);
      const pace = splitDurationSeconds / splitDistanceInUnit;

      // Determine if this is a whole split (within 5% tolerance of target distance)
      const isWhole =
        Math.abs(actualSplitDistanceMeters - targetSplitMeters) / targetSplitMeters < 0.05;

      splits.push({
        splitNumber: splits.length + 1,
        distance: splitDistanceInUnit,
        distanceUnit,
        duration: splitDurationSeconds,
        pace,
        startTime: splitStartTime,
        endTime: splitEndTime,
        cumulativeDistance: convertMetersToUnit(cumulativeDistanceMeters, distanceUnit),
        cumulativeTime: cumulativeTimeSeconds,
        isWhole,
      });

      // Reset for next split
      if (currentSplitDistanceMeters >= targetSplitMeters && i < locations.length - 1) {
        currentSplitDistanceMeters = currentSplitDistanceMeters - targetSplitMeters;
        splitStartTime = splitEndTime;
      } else {
        break; // We're done with the final split
      }
    }
  }

  return splits;
}

/**
 * Finds the fastest split across all workouts
 * @param onlyWhole - If true, only considers whole splits (default: false)
 */
export function findFastestSplit(
  splitsByWorkout: Map<string, WorkoutSplit[]>,
  workouts: ExtendedWorkout[],
  onlyWhole: boolean = false,
): {
  workout: ExtendedWorkout | null;
  split: WorkoutSplit | null;
} {
  let fastestSplit: WorkoutSplit | null = null;
  let fastestWorkout: ExtendedWorkout | null = null;

  for (const workout of workouts) {
    const splits = splitsByWorkout.get(workout.uuid) || [];

    for (const split of splits) {
      // Skip partial splits if onlyWhole is true
      if (onlyWhole && !split.isWhole) {
        continue;
      }

      if (!fastestSplit || split.duration < fastestSplit.duration) {
        fastestSplit = split;
        fastestWorkout = workout;
      }
    }
  }

  return {
    workout: fastestWorkout,
    split: fastestSplit,
  };
}

/**
 * Formats split duration as MM:SS
 */
export function formatSplitTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Formats split pace as MM:SS/unit
 */
export function formatSplitPace(pace: number, unit: LengthUnit): string {
  const minutes = Math.floor(pace / 60);
  const seconds = Math.floor(pace % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/${unit}`;
}

/**
 * Calculates time difference between two split times
 */
export function calculateTimeDifference(
  time1: number,
  time2: number,
): { diff: number; isPositive: boolean; formatted: string } {
  const diff = Math.abs(time1 - time2);
  const isPositive = time1 > time2;

  let formatted: string;
  if (diff >= 60) {
    const minutes = Math.floor(diff / 60);
    const seconds = Math.floor(diff % 60);
    formatted = seconds > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${minutes}:00`;
  } else {
    formatted = `${Math.floor(diff)}s`;
  }

  return { diff, isPositive, formatted };
}
