import { Quantity, WorkoutSample } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';

import { convertDurationToMinutes } from './time';

/**
 * Calculates the pace from a workout sample in minutes.
 * @param run - The workout sample containing total distance and duration.
 * @returns The pace as a Quantity object with unit and quantity.
 */
export const calculatePace = (run: WorkoutSample): Quantity => {
  const distance = run.totalDistance?.quantity;
  const duration = run.duration?.quantity;
  const distanceUnit = run.totalDistance?.unit;

  if (!distance || distance === 0 || !duration || duration === 0) {
    return {
      unit: `min/${distanceUnit || 'undefined'}`,
      quantity: 0,
    };
  }

  return calculatePaceFromDistanceAndDuration(run.totalDistance, run.duration);
};

export const calculatePaceFromDistanceAndDuration = (
  distance: Quantity,
  duration: Quantity,
): Quantity => {
  if (!distance || !duration || distance.quantity === 0) {
    return { unit: 'min/undefined', quantity: 0 };
  }

  const durationMinutes = convertDurationToMinutes(duration);
  const paceQuantity = Number((durationMinutes / distance.quantity).toFixed(2));

  const res = {
    unit: `min/${distance.unit}`,
    quantity: paceQuantity,
  };
  return res;
};

/**
 * Finds the fastest run (lowest pace) from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The run with the fastest pace, or undefined if no valid runs
 */
export const findFastestRun = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((prev, curr) => {
    if (!prev || !curr) {
      return prev || curr;
    }

    // Compare pace values - lower pace is faster
    if (!prev.averagePace || !curr.averagePace) {
      return prev.averagePace ? prev : curr;
    }

    return prev.averagePace.quantity <= curr.averagePace.quantity ? prev : curr;
  });
};

/**
 * Finds the slowest run (highest pace) from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The run with the slowest pace, or undefined if no valid runs
 */
export const findSlowestRun = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((prev, curr) => {
    if (!prev || !curr) {
      return prev || curr;
    }

    // Compare pace values - higher pace is slower
    if (!prev.averagePace || !curr.averagePace) {
      return prev.averagePace ? prev : curr;
    }

    return prev.averagePace.quantity >= curr.averagePace.quantity ? prev : curr;
  });
};

/**
 * Finds the run with the longest distance from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The run with the longest distance, or undefined if no valid runs
 */
export const findLongestRun = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((prev, curr) => {
    if (!prev || !curr || !prev.totalDistance || !curr.totalDistance) {
      return prev || curr;
    }

    return prev.totalDistance.quantity >= curr.totalDistance.quantity ? prev : curr;
  });
};

/**
 * Finds the run with the shortest distance from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The run with the shortest distance, or undefined if no valid runs
 */
export const findShortestRun = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((prev, curr) => {
    if (!prev || !curr || !prev.totalDistance || !curr.totalDistance) {
      return prev || curr;
    }

    return prev.totalDistance.quantity <= curr.totalDistance.quantity ? prev : curr;
  });
};

/**
 * Finds the run with the highest elevation gain from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The run with the highest elevation gain, or undefined if no valid runs
 */
export const findHighestElevationRun = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((prev, curr) => {
    if (!prev || !curr) {
      return prev || curr;
    }

    const prevElevation = prev.totalElevationAscended?.quantity || 0;
    const currElevation = curr.totalElevationAscended?.quantity || 0;

    return prevElevation >= currElevation ? prev : curr;
  });
};

/**
 * Finds the run with the lowest elevation gain from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The run with the lowest elevation gain, or undefined if no valid runs
 */
export const findLowestElevationRun = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((prev, curr) => {
    if (!prev || !curr) {
      return prev || curr;
    }

    const prevElevation = prev.totalElevationAscended?.quantity || 0;
    const currElevation = curr.totalElevationAscended?.quantity || 0;

    return prevElevation <= currElevation ? prev : curr;
  });
};

/**
 * Finds the run with the longest duration from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The run with the longest duration, or undefined if no valid runs
 */
export const findLongestDurationRun = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((prev, curr) => {
    if (!prev || !curr) {
      return prev || curr;
    }

    // Compare duration values - higher duration is longer
    if (!prev.duration || !curr.duration) {
      return prev.duration ? prev : curr;
    }

    return prev.duration.quantity >= curr.duration.quantity ? prev : curr;
  });
};
