import { LengthUnit, Quantity } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout, WorkoutProxy } from '@/types/ExtendedWorkout';
import { calculateAchievements } from '@/utils/achievements';

import { metersToMiles, metersToKilometers } from './distance';
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

const parseWorkoutSample = async ({
  sample,
  distanceUnit,
}: {
  sample: WorkoutProxy;
  distanceUnit: LengthUnit;
}): Promise<ExtendedWorkout | null> => {
  try {
    // Create deep copy to avoid mutation issues with Proxy
    const plainRun = JSON.parse(JSON.stringify(sample));

    // Convert totalDistance to the specified unit
    let transformedTotalDistance;
    let totalDistance = plainRun.totalDistance;

    if (!totalDistance) {
      console.log('plainRun', plainRun);
      console.warn('No totalDistance found, using default of 0 m');

      totalDistance = { quantity: 0, unit: 'm' };
    }

    if (distanceUnit === 'mi') {
      transformedTotalDistance = metersToMiles(totalDistance);
    } else if (distanceUnit === 'km') {
      transformedTotalDistance = metersToKilometers(totalDistance);
    }

    // Convert startDate and endDate to Date objects
    const startDate = new Date(plainRun.startDate);
    const endDate = new Date(plainRun.endDate);
    const totalElevationAscended = (sample.metadata?.[
      'HKElevationAscended'
    ] as unknown as Quantity) || { quantity: 0, unit: 'm' };

    const newRun: ExtendedWorkout = {
      ...plainRun,
      totalDistance: transformedTotalDistance,
      startDate,
      endDate,
      proxy: sample,
    };

    // This has to use newRun to ensure the correct units are used
    const averagePace = calculatePace(newRun);

    return {
      ...newRun,
      averagePace,
      totalElevation: totalElevationAscended,
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
  } catch (error) {
    console.error('Failed to parse workout sample:', error);
    return null;
  }
};
