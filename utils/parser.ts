import { LengthUnit, Quantity } from '@kingstinct/react-native-healthkit';
import { QueryWorkoutSamplesWithAnchorResponse } from '@kingstinct/react-native-healthkit/types';

import { ExtendedWorkout, WorkoutAchievements } from '@/types/ExtendedWorkout';

import { metersToMiles, metersToKilometers } from './distance';
import { formatPace } from './time';
import {
  calculatePace,
  findFastestRun,
  findLongestRun,
  findHighestElevationRun,
  findLongestDurationRun,
} from './workout';

type WorkoutProxy = QueryWorkoutSamplesWithAnchorResponse['workouts'][number];

export const parseWorkoutSamples = async ({
  samples,
  distanceUnit,
}: {
  samples: WorkoutProxy[];
  distanceUnit: LengthUnit;
}): Promise<ExtendedWorkout[]> => {
  // First pass: Parse all workouts without achievements
  const parsedWorkouts = await Promise.all(
    samples.map((sample) => parseWorkoutSample({ sample, distanceUnit })),
  ).then((results) => results.filter((run) => run !== null) as ExtendedWorkout[]);

  // Second pass: Calculate achievements for each workout
  return parsedWorkouts.map((workout) => ({
    ...workout,
    achievements: calculateAchievements(workout, parsedWorkouts),
  }));
};

const parseWorkoutSample = async ({
  sample,
  distanceUnit,
}: {
  sample: WorkoutProxy;
  distanceUnit: LengthUnit;
}): Promise<ExtendedWorkout | null> => {
  const route = await sample.getWorkoutRoutes();
  const plan = await sample.getWorkoutPlan();

  // Create deep copy to avoid mutation issues with Proxy
  const plainRun = JSON.parse(JSON.stringify(sample));

  // Convert totalDistance to the specified unit
  let totalDistance = plainRun.totalDistance;

  if (distanceUnit === 'mi') {
    totalDistance = metersToMiles(plainRun.totalDistance);
  } else if (distanceUnit === 'km') {
    totalDistance = metersToKilometers(plainRun.totalDistance);
  }

  // Convert startDate and endDate to Date objects
  const startDate = new Date(plainRun.startDate);
  const endDate = new Date(plainRun.endDate);
  const totalElevationAscended = (sample.metadata?.[
    'HKElevationAscended'
  ] as unknown as Quantity) || { quantity: 0, unit: 'm' };

  const newRun: ExtendedWorkout = {
    ...plainRun,
    totalDistance,
    startDate,
    endDate,
    plan,
    route,
  };

  // This has to use newRun to ensure the correct units are used
  const averagePace = calculatePace(newRun);

  return {
    ...newRun,
    averagePace,
    totalElevationAscended,
    humidity: sample.metadata?.['HKWeatherHumidity'] as unknown as Quantity,
    prettyPace: formatPace(averagePace),
    daysAgo: `${Math.floor(
      (Date.now() - newRun.startDate.getTime()) / (1000 * 60 * 60 * 24),
    )} days ago`,
    achievements: {
      isAllTimeFastest: false,
      isAllTimeLongest: false,
      isAllTimeFurthest: false,
      isAllTimeHighestElevation: false,
    },
  } satisfies ExtendedWorkout;
};

/**
 * Calculates achievements for a specific workout compared to all workouts
 */
const calculateAchievements = (
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
