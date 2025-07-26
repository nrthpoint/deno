import { ExtendedWorkout } from '@/types/workout';
import { LengthUnit, WorkoutSample } from '@kingstinct/react-native-healthkit';
import { metersToMiles, metersToKilometers } from './distance';
import { calculatePace, formatPace } from './workout';

export const parseWorkoutSamples = ({
  samples,
  distanceUnit,
}: {
  samples: WorkoutSample[];
  distanceUnit: LengthUnit;
}): ExtendedWorkout[] => {
  return samples
    .map((sample) => parseWorkoutSample({ sample, distanceUnit }))
    .filter((run) => run !== null) as ExtendedWorkout[];
};

const parseWorkoutSample = ({
  sample,
  distanceUnit,
}: {
  sample: WorkoutSample;
  distanceUnit: LengthUnit;
}): ExtendedWorkout | null => {
  if (!sample.totalDistance) {
    console.warn(`Run with ID ${sample.uuid} has no total distance. Skipping.`);
    return null;
  }

  // Create deep copy to avoid mutation issues with Proxy
  const plainRun = JSON.parse(JSON.stringify(sample));

  // Convert distance to target unit if necessary.
  let totalDistance;

  if (distanceUnit === 'mi') {
    totalDistance = metersToMiles(plainRun.totalDistance);
  } else if (distanceUnit === 'km') {
    totalDistance = metersToKilometers(plainRun.totalDistance);
  } else {
    // Default to meters if no conversion is needed. This assumes the distance is already in meters.
    totalDistance = plainRun.totalDistance;
  }

  const startDate = new Date(plainRun.startDate);
  const endDate = new Date(plainRun.endDate);

  const newRun: ExtendedWorkout = {
    ...plainRun,
    totalDistance,
    startDate,
    endDate,
  };

  const averagePace = calculatePace(newRun);

  return {
    ...newRun,
    averagePace,
    prettyPace: formatPace(averagePace),
    daysAgo: `${Math.floor(
      (Date.now() - newRun.startDate.getTime()) / (1000 * 60 * 60 * 24),
    )} days ago`,
  } satisfies ExtendedWorkout;
};
