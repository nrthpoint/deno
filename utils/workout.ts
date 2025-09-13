import { LengthUnit, Quantity, WorkoutSample } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { newQuantity } from '@/utils/quantity';

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

    const prevElevation = prev.totalElevation?.quantity || 0;
    const currElevation = curr.totalElevation?.quantity || 0;

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

    const prevElevation = prev.totalElevation?.quantity || 0;
    const currElevation = curr.totalElevation?.quantity || 0;

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

/**
 * Calculates the average duration of an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The average duration as a Quantity object
 */
export const calculateAverageDuration = (runs: ExtendedWorkout[]): Quantity => {
  if (runs.length === 0) {
    return newQuantity(0, 's');
  }

  const total = runs.reduce((sum, run) => sum + run.duration.quantity, 0);
  return newQuantity(total / runs.length, 's');
};

export const calculateAverageDistance = (
  runs: ExtendedWorkout[],
  distanceUnit: LengthUnit,
): Quantity => {
  if (runs.length === 0) {
    return newQuantity(0, distanceUnit);
  }

  const total = runs.reduce((sum, run) => sum + run.totalDistance.quantity, 0);
  return newQuantity(total / runs.length, distanceUnit);
};

/**
 * Finds the most frequently occurring pace among runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The most frequent pace as a Quantity object
 */
export const getMostFrequentPace = (runs: ExtendedWorkout[]): Quantity => {
  if (runs.length === 0) {
    return newQuantity(0, 'min/mi');
  }

  // Count frequency of pace values (rounded to nearest second for grouping)
  const paceFrequency = new Map<number, number>();
  let mostFrequentPace = runs[0].averagePace;

  runs.forEach((run) => {
    const roundedPace = Math.round(run.averagePace.quantity);
    const count = (paceFrequency.get(roundedPace) || 0) + 1;
    paceFrequency.set(roundedPace, count);
  });

  // Find the pace with highest frequency
  let maxCount = 0;
  for (const [pace, count] of paceFrequency.entries()) {
    if (count > maxCount) {
      maxCount = count;
      const matchingRun = runs.find((run) => Math.round(run.averagePace.quantity) === pace);
      if (matchingRun) {
        mostFrequentPace = matchingRun.averagePace;
      }
    }
  }

  return mostFrequentPace;
};

/**
 * Finds the most frequently occurring duration among runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The most frequent duration as a Quantity object
 */
export const getMostFrequentDuration = (runs: ExtendedWorkout[]): Quantity => {
  if (runs.length === 0) {
    return newQuantity(0, 's');
  }

  // Count frequency of duration values (rounded to nearest minute for grouping)
  const durationFrequency = new Map<number, number>();
  let mostFrequentDuration = runs[0].duration;

  runs.forEach((run) => {
    const roundedDuration = Math.round(run.duration.quantity / 60) * 60; // Round to nearest minute
    const count = (durationFrequency.get(roundedDuration) || 0) + 1;
    durationFrequency.set(roundedDuration, count);
  });

  // Find the duration with highest frequency
  let maxCount = 0;
  for (const [duration, count] of durationFrequency.entries()) {
    if (count > maxCount) {
      maxCount = count;
      const matchingRun = runs.find(
        (run) => Math.round(run.duration.quantity / 60) * 60 === duration,
      );
      if (matchingRun) {
        mostFrequentDuration = matchingRun.duration;
      }
    }
  }

  return mostFrequentDuration;
};

/**
 * Finds the most frequently occurring humidity among runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The most frequent humidity as a Quantity object
 */
export const getMostFrequentHumidity = (runs: ExtendedWorkout[]): Quantity => {
  if (runs.length === 0) {
    return newQuantity(0, '%');
  }

  // Filter out runs without humidity data
  const runsWithHumidity = runs.filter((run) => run.humidity && run.humidity.quantity > 0);

  if (runsWithHumidity.length === 0) {
    return newQuantity(0, '%');
  }

  // Count frequency of humidity values (rounded to nearest 5% for grouping)
  const humidityFrequency = new Map<number, number>();
  let mostFrequentHumidity = runsWithHumidity[0].humidity;

  runsWithHumidity.forEach((run) => {
    const roundedHumidity = Math.round(run.humidity.quantity / 5) * 5; // Round to nearest 5%
    const count = (humidityFrequency.get(roundedHumidity) || 0) + 1;
    humidityFrequency.set(roundedHumidity, count);
  });

  // Find the humidity with highest frequency
  let maxCount = 0;
  for (const [humidity, count] of humidityFrequency.entries()) {
    if (count > maxCount) {
      maxCount = count;
      const matchingRun = runsWithHumidity.find(
        (run) => Math.round(run.humidity.quantity / 5) * 5 === humidity,
      );
      if (matchingRun) {
        mostFrequentHumidity = matchingRun.humidity;
      }
    }
  }

  return mostFrequentHumidity;
};

export const getMostFrequentDistance = (runs: ExtendedWorkout[]): Quantity => {
  if (runs.length === 0) {
    return newQuantity(0, 'mi');
  }

  // Count frequency of distance values (rounded to nearest 0.1 mile for grouping)
  const distanceFrequency = new Map<number, number>();
  let mostFrequentDistance = runs[0].totalDistance;

  runs.forEach((run) => {
    const roundedDistance = Math.round(run.totalDistance.quantity * 10) / 10; // Round to nearest 0.1
    const count = (distanceFrequency.get(roundedDistance) || 0) + 1;
    distanceFrequency.set(roundedDistance, count);
  });

  // Find the distance with highest frequency
  let maxCount = 0;
  for (const [distance, count] of distanceFrequency.entries()) {
    if (count > maxCount) {
      maxCount = count;
      const matchingRun = runs.find(
        (run) => Math.round(run.totalDistance.quantity * 10) / 10 === distance,
      );
      if (matchingRun) {
        mostFrequentDistance = matchingRun.totalDistance;
      }
    }
  }

  return mostFrequentDistance;
};

export const getMostFrequentElevation = (runs: ExtendedWorkout[]): Quantity => {
  if (runs.length === 0) {
    return newQuantity(0, 'ft');
  }

  // Count frequency of elevation values (rounded to nearest 10 feet for grouping)
  const elevationFrequency = new Map<number, number>();
  let mostFrequentElevation = runs[0].totalElevation;

  runs.forEach((run) => {
    const roundedElevation = Math.round(run.totalElevation.quantity / 10) * 10; // Round to nearest 10 ft
    const count = (elevationFrequency.get(roundedElevation) || 0) + 1;
    elevationFrequency.set(roundedElevation, count);
  });

  // Find the elevation with highest frequency
  let maxCount = 0;
  for (const [elevation, count] of elevationFrequency.entries()) {
    if (count > maxCount) {
      maxCount = count;
      const matchingRun = runs.find(
        (run) => Math.round(run.totalElevation.quantity / 10) * 10 === elevation,
      );
      if (matchingRun) {
        mostFrequentElevation = matchingRun.totalElevation;
      }
    }
  }

  return mostFrequentElevation;
};

/**
 * Finds the most recent workout from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The workout with the latest start date
 */
export const getMostRecentWorkout = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((latest, run) => (run.startDate > latest.startDate ? run : latest));
};

/**
 * Finds the oldest workout from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The workout with the earliest start date
 */
export const getOldestWorkout = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((earliest, run) => (run.startDate < earliest.startDate ? run : earliest));
};

/**
 * Finds the workout with the greatest elevation from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The workout with the highest elevation
 */
export const getGreatestElevationWorkout = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((max, run) =>
    run.totalElevation.quantity > max.totalElevation.quantity ? run : max,
  );
};

/**
 * Finds the workout with the lowest elevation from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The workout with the lowest elevation
 */
export const getLowestElevationWorkout = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((min, run) =>
    run.totalElevation.quantity < min.totalElevation.quantity ? run : min,
  );
};
