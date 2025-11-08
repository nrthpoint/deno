import { LengthUnit } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout, WorkoutProxy } from '@/types/ExtendedWorkout';
import { parseWorkoutSample } from '@/utils/parser/individual';
import {
  findFastestRun,
  findHighestElevationRun,
  findLongestRun,
  findFurthestRun,
} from '@/utils/workout';

export const parseWorkoutSamples = async ({
  samples,
  distanceUnit,
}: {
  samples: WorkoutProxy[];
  distanceUnit: LengthUnit;
}): Promise<ExtendedWorkout[]> => {
  const parsedResults = await Promise.all(
    samples.map((sample) => parseWorkoutSample({ sample, distanceUnit })),
  );

  const parsedWorkouts = parsedResults.filter((run): run is ExtendedWorkout => run !== null);

  // If no workouts, return empty array
  if (parsedWorkouts.length === 0) {
    return [];
  }

  const fastestWorkout = findFastestRun(parsedWorkouts);
  const longestWorkout = findLongestRun(parsedWorkouts);
  const furthestWorkout = findFurthestRun(parsedWorkouts);
  const highestElevationWorkout = findHighestElevationRun(parsedWorkouts);

  return parsedWorkouts.map((workout) => ({
    ...workout,
    achievements: {
      isAllTimeFastest: workout.uuid === fastestWorkout.uuid,
      isAllTimeLongest: workout.uuid === longestWorkout.uuid,
      isAllTimeFurthest: workout.uuid === furthestWorkout.uuid,
      isAllTimeHighestElevation: workout.uuid === highestElevationWorkout.uuid,
    },
  }));
};
