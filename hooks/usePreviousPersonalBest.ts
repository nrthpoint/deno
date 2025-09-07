import { useMemo } from 'react';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';

/**
 * Hook to get the previous personal best workout for comparison
 * This finds the workout that held the personal best record before the current one
 */
export function usePreviousPersonalBest(
  currentWorkout: ExtendedWorkout,
  allWorkouts: ExtendedWorkout[],
): ExtendedWorkout | null {
  return useMemo(() => {
    if (!currentWorkout || allWorkouts.length <= 1) {
      return null;
    }

    // Find what type of personal best the current workout is
    const { achievements } = currentWorkout;

    // Sort workouts by date to find the previous record holder
    const sortedWorkouts = allWorkouts
      .filter((w) => w.uuid !== currentWorkout.uuid)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    let previousBest: ExtendedWorkout | null = null;

    if (achievements.isAllTimeFastest) {
      // Find the fastest workout excluding the current one
      previousBest = sortedWorkouts.reduce(
        (fastest, workout) => {
          if (!fastest || !workout.averagePace) return fastest || workout;
          if (!fastest.averagePace) return workout;

          return fastest.averagePace.quantity <= workout.averagePace.quantity ? fastest : workout;
        },
        null as ExtendedWorkout | null,
      );
    } else if (achievements.isAllTimeLongest) {
      // Find the longest duration workout excluding the current one
      previousBest = sortedWorkouts.reduce(
        (longest, workout) => {
          if (!longest || !workout.duration) return longest || workout;
          if (!longest.duration) return workout;

          return longest.duration.quantity >= workout.duration.quantity ? longest : workout;
        },
        null as ExtendedWorkout | null,
      );
    } else if (achievements.isAllTimeFurthest) {
      // Find the furthest distance workout excluding the current one
      previousBest = sortedWorkouts.reduce(
        (furthest, workout) => {
          if (!furthest || !workout.totalDistance) return furthest || workout;
          if (!furthest.totalDistance) return workout;

          return furthest.totalDistance.quantity >= workout.totalDistance.quantity
            ? furthest
            : workout;
        },
        null as ExtendedWorkout | null,
      );
    } else if (achievements.isAllTimeHighestElevation) {
      // Find the highest elevation workout excluding the current one
      previousBest = sortedWorkouts.reduce(
        (highest, workout) => {
          if (!highest) return workout;

          const highestElevation = highest.totalElevation?.quantity || 0;
          const currentElevation = workout.totalElevation?.quantity || 0;

          return highestElevation >= currentElevation ? highest : workout;
        },
        null as ExtendedWorkout | null,
      );
    }

    return previousBest;
  }, [currentWorkout, allWorkouts]);
}

/**
 * Hook to check if a workout broke a personal best and get the previous record
 */
export function usePersonalBestComparison(
  workout: ExtendedWorkout,
  allWorkouts: ExtendedWorkout[],
): {
  hasBrokenRecord: boolean;
  recordType: string | null;
  previousBest: ExtendedWorkout | null;
  improvement: string | null;
} {
  const previousBest = usePreviousPersonalBest(workout, allWorkouts);

  return useMemo(() => {
    if (!previousBest || !workout) {
      return {
        hasBrokenRecord: false,
        recordType: null,
        previousBest: null,
        improvement: null,
      };
    }

    const { achievements } = workout;
    let recordType: string | null = null;
    let improvement: string | null = null;

    if (achievements.isAllTimeFastest && workout.averagePace && previousBest.averagePace) {
      recordType = 'Fastest Pace';
      const improvementSeconds = previousBest.averagePace.quantity - workout.averagePace.quantity;
      improvement = `${improvementSeconds.toFixed(1)}s faster per ${workout.averagePace.unit.split('/')[1]}`;
    } else if (achievements.isAllTimeLongest && workout.duration && previousBest.duration) {
      recordType = 'Longest Duration';
      const improvementMinutes = (workout.duration.quantity - previousBest.duration.quantity) / 60;
      improvement = `${improvementMinutes.toFixed(1)} minutes longer`;
    } else if (
      achievements.isAllTimeFurthest &&
      workout.totalDistance &&
      previousBest.totalDistance
    ) {
      recordType = 'Furthest Distance';
      const improvementDistance =
        workout.totalDistance.quantity - previousBest.totalDistance.quantity;
      improvement = `${improvementDistance.toFixed(2)} ${workout.totalDistance.unit} further`;
    } else if (
      achievements.isAllTimeHighestElevation &&
      workout.totalElevation &&
      previousBest.totalElevation
    ) {
      recordType = 'Highest Elevation';
      const improvementElevation =
        workout.totalElevation.quantity - previousBest.totalElevation.quantity;
      improvement = `${improvementElevation.toFixed(0)} ${workout.totalElevation.unit} higher`;
    }

    return {
      hasBrokenRecord: recordType !== null,
      recordType,
      previousBest,
      improvement,
    };
  }, [workout, previousBest]);
}
