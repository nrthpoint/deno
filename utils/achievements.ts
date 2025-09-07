/**
 * Achievement Calculation Utilities
 *
 * This module contains pure functions for calculating workout achievements.
 * It's separated from the notification system to avoid circular dependencies.
 */

import { ExtendedWorkout, WorkoutAchievements } from '@/types/ExtendedWorkout';
import {
  findFastestRun,
  findHighestElevationRun,
  findLongestDurationRun,
  findLongestRun,
} from '@/utils/workout';

/**
 * Calculates achievements for a specific workout compared to all workouts
 * This is the consolidated function used by both parser.ts and achievement notifications
 */
export const calculateAchievements = (
  currentWorkout: ExtendedWorkout,
  allWorkouts: ExtendedWorkout[],
): WorkoutAchievements => {
  const fastestWorkout = findFastestRun(allWorkouts);
  const longestWorkout = findLongestDurationRun(allWorkouts);
  const furthestWorkout = findLongestRun(allWorkouts);
  const highestElevationWorkout = findHighestElevationRun(allWorkouts);

  return {
    isAllTimeFastest: currentWorkout.uuid === fastestWorkout.uuid,
    isAllTimeLongest: currentWorkout.uuid === longestWorkout.uuid,
    isAllTimeFurthest: currentWorkout.uuid === furthestWorkout.uuid,
    isAllTimeHighestElevation: currentWorkout.uuid === highestElevationWorkout.uuid,
  } satisfies WorkoutAchievements;
};
