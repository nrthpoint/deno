import { LengthUnit, Quantity } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { newQuantity } from '@/utils/quantity';

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
    if (!prev.pace || !curr.pace) {
      return prev.pace ? prev : curr;
    }

    return prev.pace.quantity <= curr.pace.quantity ? prev : curr;
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
    if (!prev.pace || !curr.pace) {
      return prev.pace ? prev : curr;
    }

    return prev.pace.quantity >= curr.pace.quantity ? prev : curr;
  });
};

/**
 * Finds the run with the longest distance from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The run with the longest distance, or undefined if no valid runs
 */
export const findFurthestRun = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((prev, curr) => {
    if (!prev || !curr || !prev.distance || !curr.distance) {
      return prev || curr;
    }

    return prev.distance.quantity >= curr.distance.quantity ? prev : curr;
  });
};

/**
 * Finds the run with the shortest distance from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The run with the shortest distance, or undefined if no valid runs
 */
export const findShortestRun = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((prev, curr) => {
    if (!prev || !curr || !prev.distance || !curr.distance) {
      return prev || curr;
    }

    return prev.distance.quantity <= curr.distance.quantity ? prev : curr;
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

    const prevElevation = prev.elevation?.quantity || 0;
    const currElevation = curr.elevation?.quantity || 0;

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

    const prevElevation = prev.elevation?.quantity || 0;
    const currElevation = curr.elevation?.quantity || 0;

    return prevElevation <= currElevation ? prev : curr;
  });
};

/**
 * Finds the run with the longest duration from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The run with the longest duration, or undefined if no valid runs
 */
export const findLongestRun = (runs: ExtendedWorkout[]): ExtendedWorkout => {
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
 * Finds the run with the shortest duration from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The run with the shortest duration, or undefined if no valid runs
 */
export const findShortestDurationRun = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((prev, curr) => {
    if (!prev || !curr) {
      return prev || curr;
    }

    // Compare duration values - lower duration is shorter
    if (!prev.duration || !curr.duration) {
      return prev.duration ? prev : curr;
    }

    return prev.duration.quantity <= curr.duration.quantity ? prev : curr;
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

  const total = runs.reduce((sum, run) => sum + run.distance.quantity, 0);
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
  let mostFrequentPace = runs[0].pace;

  runs.forEach((run) => {
    const roundedPace = Math.round(run.pace.quantity);
    const count = (paceFrequency.get(roundedPace) || 0) + 1;
    paceFrequency.set(roundedPace, count);
  });

  // Find the pace with highest frequency
  let maxCount = 0;
  for (const [pace, count] of paceFrequency.entries()) {
    if (count > maxCount) {
      maxCount = count;
      const matchingRun = runs.find((run) => Math.round(run.pace.quantity) === pace);
      if (matchingRun) {
        mostFrequentPace = matchingRun.pace;
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

/**
 * Finds the most frequently occurring temperature among runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The most frequent temperature as a Quantity object
 */
export const getMostFrequentTemperature = (runs: ExtendedWorkout[]): Quantity => {
  if (runs.length === 0) {
    return newQuantity(20, '°C');
  }

  // Filter out runs without temperature data
  const runsWithTemperature = runs.filter(
    (run) => run.temperature && run.temperature.quantity !== undefined,
  );

  if (runsWithTemperature.length === 0) {
    return newQuantity(20, '°C');
  }

  // Count frequency of temperature values (rounded to nearest 2°C for grouping)
  const temperatureFrequency = new Map<number, number>();
  let mostFrequentTemperature = runsWithTemperature[0].temperature;

  runsWithTemperature.forEach((run) => {
    const roundedTemperature = Math.round(run.temperature.quantity / 2) * 2; // Round to nearest 2°C
    const count = (temperatureFrequency.get(roundedTemperature) || 0) + 1;
    temperatureFrequency.set(roundedTemperature, count);
  });

  // Find the temperature with highest frequency
  let maxCount = 0;
  for (const [temperature, count] of temperatureFrequency.entries()) {
    if (count > maxCount) {
      maxCount = count;
      const matchingRun = runsWithTemperature.find(
        (run) => Math.round(run.temperature.quantity / 2) * 2 === temperature,
      );
      if (matchingRun) {
        mostFrequentTemperature = matchingRun.temperature;
      }
    }
  }

  return mostFrequentTemperature;
};

export const getMostFrequentDistance = (runs: ExtendedWorkout[]): Quantity => {
  if (runs.length === 0) {
    return newQuantity(0, 'mi');
  }

  // Count frequency of distance values (rounded to nearest 0.1 mile for grouping)
  const distanceFrequency = new Map<number, number>();
  let mostFrequentDistance = runs[0].distance;

  runs.forEach((run) => {
    const roundedDistance = Math.round(run.distance.quantity * 10) / 10; // Round to nearest 0.1
    const count = (distanceFrequency.get(roundedDistance) || 0) + 1;
    distanceFrequency.set(roundedDistance, count);
  });

  // Find the distance with highest frequency
  let maxCount = 0;
  for (const [distance, count] of distanceFrequency.entries()) {
    if (count > maxCount) {
      maxCount = count;
      const matchingRun = runs.find(
        (run) => Math.round(run.distance.quantity * 10) / 10 === distance,
      );
      if (matchingRun) {
        mostFrequentDistance = matchingRun.distance;
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
  let mostFrequentElevation = runs[0].elevation;

  runs.forEach((run) => {
    const roundedElevation = Math.round(run.elevation.quantity / 10) * 10; // Round to nearest 10 ft
    const count = (elevationFrequency.get(roundedElevation) || 0) + 1;
    elevationFrequency.set(roundedElevation, count);
  });

  // Find the elevation with highest frequency
  let maxCount = 0;
  for (const [elevation, count] of elevationFrequency.entries()) {
    if (count > maxCount) {
      maxCount = count;
      const matchingRun = runs.find(
        (run) => Math.round(run.elevation.quantity / 10) * 10 === elevation,
      );
      if (matchingRun) {
        mostFrequentElevation = matchingRun.elevation;
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
  return runs.reduce((max, run) => (run.elevation.quantity > max.elevation.quantity ? run : max));
};

/**
 * Finds the workout with the lowest elevation from an array of runs
 * @param runs - Array of ExtendedWorkout objects
 * @returns The workout with the lowest elevation
 */
export const getLowestElevationWorkout = (runs: ExtendedWorkout[]): ExtendedWorkout => {
  return runs.reduce((min, run) => (run.elevation.quantity < min.elevation.quantity ? run : min));
};
