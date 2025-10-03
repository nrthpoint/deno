import { LengthUnit, Quantity } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout, WorkoutProxy } from '@/types/ExtendedWorkout';
import { calculateAchievements } from '@/utils/achievements';
import { convertDistanceToUnit } from '@/utils/distance';

import { formatPace } from './time';
import { calculatePace } from './workout';

export const parseWorkoutSamples = async ({
  samples,
  distanceUnit,
}: {
  samples: WorkoutProxy[];
  distanceUnit: LengthUnit;
}): Promise<ExtendedWorkout[]> => {
  // First pass: Parse all workouts without achievements
  const parsedWorkouts = await Promise.all(
    samples.map(async (sample) => parseWorkoutSample({ sample, distanceUnit })),
  ).then((results) => results.filter((run) => run !== null) as ExtendedWorkout[]);

  // Second pass: Calculate achievements for each workout
  return parsedWorkouts.map((workout) => {
    try {
      return {
        ...workout,
        achievements: calculateAchievements(workout, parsedWorkouts),
      };
    } catch (error) {
      console.error('Failed to calculate achievements for workout:', error);
      return {
        ...workout,
        achievements: {
          isAllTimeFastest: false,
          isAllTimeLongest: false,
          isAllTimeFurthest: false,
          isAllTimeHighestElevation: false,
        },
      };
    }
  });
};

const convertDistance = async (
  sample: WorkoutProxy,
  distanceUnit: LengthUnit,
): Promise<Quantity> => {
  let totalDistanceStat = await sample.getStatistic(
    'HKQuantityTypeIdentifierDistanceWalkingRunning',
  );

  if (!totalDistanceStat) {
    throw new Error('No totalDistance statistic found on workout sample');
  }

  let { sumQuantity } = totalDistanceStat;

  if (!sumQuantity) {
    throw new Error('No sumQuantity found on totalDistance statistic');
  }

  return convertDistanceToUnit(sumQuantity, distanceUnit);
};

const getDaysAgo = (date: Date): string =>
  `${Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))} days ago`;

const parseWorkoutSample = async ({
  sample,
  distanceUnit,
}: {
  sample: WorkoutProxy;
  distanceUnit: LengthUnit;
}): Promise<ExtendedWorkout | null> => {
  try {
    const { workoutActivityType, duration, uuid, startDate, endDate } = sample;

    const totalDistance = await convertDistance(sample, distanceUnit);

    const totalElevation = (sample.metadata?.['HKElevationAscended'] as unknown as Quantity) || {
      quantity: 0,
      unit: 'm',
    };
    const humidity = (sample.metadata?.['HKWeatherHumidity'] as unknown as Quantity) || {
      quantity: 0,
      unit: '%',
    };
    const isIndoor = sample.metadata?.['HKIndoorWorkout'] as boolean;

    const averagePace = calculatePace(totalDistance, duration);
    const prettyPace = formatPace(averagePace);
    const daysAgo = getDaysAgo(startDate);
    const achievements = {
      isAllTimeFastest: false,
      isAllTimeLongest: false,
      isAllTimeFurthest: false,
      isAllTimeHighestElevation: false,
    };

    return {
      ...sample,
      proxy: sample,
      totalDistance,
      startDate,
      endDate,
      totalElevation,
      humidity,
      averagePace,
      daysAgo,
      prettyPace,
      achievements,
      isIndoor,
      uuid,
      workoutActivityType,
      duration,
    };
  } catch (error) {
    console.error('Failed to parse workout sample:', error);

    return null;
  }
};
