import { LengthUnit } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import {
  calculateExactDistanceSplits,
  findFastestSplit,
  formatSplitTime,
} from '@/utils/workoutSplits';

export interface ProfileStats {
  fastestWorkout: {
    workout: ExtendedWorkout | null;
    pace: string;
  };
  longestWorkout: {
    workout: ExtendedWorkout | null;
    duration: string;
  };
  highestElevationWorkout: {
    workout: ExtendedWorkout | null;
    elevation: string;
  };
  fastestSplit: {
    workout: ExtendedWorkout | null;
    splitTime: string;
    splitNumber: number;
  };
  shortestWorkout: {
    workout: ExtendedWorkout | null;
    duration: string;
  };
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

export function formatElevation(elevation: number, unit: string): string {
  return `${Math.round(elevation).toLocaleString()} ${unit}`;
}

export async function calculateProfileStats(
  workouts: ExtendedWorkout[],
  distanceUnit: LengthUnit,
): Promise<ProfileStats> {
  if (workouts.length === 0) {
    return {
      fastestWorkout: { workout: null, pace: 'N/A' },
      longestWorkout: { workout: null, duration: 'N/A' },
      highestElevationWorkout: { workout: null, elevation: 'N/A' },
      fastestSplit: { workout: null, splitTime: 'N/A', splitNumber: 0 },
      shortestWorkout: { workout: null, duration: 'N/A' },
    };
  }

  // Find fastest workout (best average pace)
  const fastestWorkout = workouts.reduce((fastest, current) => {
    const currentPace = current.pace?.quantity || Number.MAX_SAFE_INTEGER;
    const fastestPace = fastest.pace?.quantity || Number.MAX_SAFE_INTEGER;

    return currentPace < fastestPace ? current : fastest;
  });

  // Find longest workout (by duration)
  const longestWorkout = workouts.reduce((longest, current) => {
    const currentDuration = current.duration?.quantity || 0;
    const longestDuration = longest.duration?.quantity || 0;
    return currentDuration > longestDuration ? current : longest;
  });

  // Find shortest workout (by duration, excluding very short workouts < 5 minutes)
  const shortestWorkout = workouts
    .filter((workout) => (workout.duration?.quantity || 0) >= 300) // At least 5 minutes
    .reduce((shortest, current) => {
      const currentDuration = current.duration?.quantity || Number.MAX_SAFE_INTEGER;
      const shortestDuration = shortest.duration?.quantity || Number.MAX_SAFE_INTEGER;
      return currentDuration < shortestDuration ? current : shortest;
    });

  const highestElevationWorkout = workouts.reduce((highest, current) => {
    const currentElevation = current.elevation?.quantity || 0;
    const highestElevation = highest.elevation?.quantity || 0;

    return currentElevation > highestElevation ? current : highest;
  });

  // Find fastest whole split across all workouts
  const splitsByWorkout = await calculateExactDistanceSplits(workouts, distanceUnit);
  const { workout: fastestSplitWorkout, split } = findFastestSplit(splitsByWorkout, workouts, true);

  const fastestSplit = {
    workout: fastestSplitWorkout,
    splitTime: split ? formatSplitTime(split.duration) : 'N/A',
    splitNumber: split?.splitNumber || 0,
  };

  return {
    fastestWorkout: {
      workout: fastestWorkout,
      pace: fastestWorkout.pace.formatted,
    },
    longestWorkout: {
      workout: longestWorkout,
      duration: longestWorkout.duration?.quantity
        ? formatDuration(longestWorkout.duration.quantity)
        : 'N/A',
    },
    shortestWorkout: {
      workout: shortestWorkout,
      duration: shortestWorkout.duration?.quantity
        ? formatDuration(shortestWorkout.duration.quantity)
        : 'N/A',
    },
    highestElevationWorkout: {
      workout: highestElevationWorkout,
      elevation: highestElevationWorkout.elevation.formatted,
    },
    fastestSplit,
  };
}
