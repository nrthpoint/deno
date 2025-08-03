import { ExtendedWorkout } from '@/types/workout';
import { LengthUnit, Quantity, WorkoutSample } from '@kingstinct/react-native-healthkit';
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
  } satisfies ExtendedWorkout;
};
