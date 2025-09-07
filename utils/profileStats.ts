import { LengthUnit } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { calculateWorkoutSplits } from '@/utils/splits';

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
    const currentPace = current.averagePace?.quantity || Number.MAX_SAFE_INTEGER;
    const fastestPace = fastest.averagePace?.quantity || Number.MAX_SAFE_INTEGER;
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

  // Find highest elevation workout
  const highestElevationWorkout = workouts.reduce((highest, current) => {
    const currentElevation = current.totalElevation?.quantity || 0;
    const highestElevation = highest.totalElevation?.quantity || 0;
    return currentElevation > highestElevation ? current : highest;
  });

  // Find fastest individual split across all workouts
  let fastestSplit = {
    workout: null as ExtendedWorkout | null,
    splitTime: 'N/A',
    splitNumber: 0,
  };

  let bestSplitTime = Number.MAX_SAFE_INTEGER;

  // Check splits for top 10 recent workouts (to avoid processing too many)
  const recentWorkouts = workouts.slice(0, 10);

  for (const workout of recentWorkouts) {
    try {
      const splits = await calculateWorkoutSplits(workout);

      for (const split of splits) {
        // Only consider splits that match the selected distance unit and are close to 1 unit
        if (
          split.distanceUnit === distanceUnit &&
          split.distance >= 0.9 &&
          split.distance <= 1.1 &&
          split.duration < bestSplitTime
        ) {
          bestSplitTime = split.duration;
          fastestSplit = {
            workout,
            splitTime: formatDuration(split.duration),
            splitNumber: split.splitNumber,
          };
        }
      }
    } catch (error) {
      // Skip this workout if split calculation fails
      console.warn('Failed to calculate splits for workout:', error);
    }
  }

  return {
    fastestWorkout: {
      workout: fastestWorkout,
      pace: fastestWorkout.prettyPace || 'N/A',
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
      elevation: highestElevationWorkout.totalElevation?.quantity
        ? formatElevation(
            highestElevationWorkout.totalElevation.quantity,
            highestElevationWorkout.totalElevation.unit || 'm',
          )
        : 'N/A',
    },
    fastestSplit,
  };
}
