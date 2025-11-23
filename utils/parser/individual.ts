import { LengthUnit } from '@kingstinct/react-native-healthkit';

import { WorkoutProxy, ExtendedWorkout } from '@/types/ExtendedWorkout';
import { retrieveDistanceFromSample } from '@/utils/distance';
import {
  normalizeGenericQuantity,
  normalizeElevationMeters,
  normalizeHumidity,
  normalizeTemperatureC,
  normalizeMETs,
} from '@/utils/normalize';
import { calculatePace } from '@/utils/pace';
import { getDaysAgo } from '@/utils/time';

export const parseWorkoutSample = async ({
  sample,
  distanceUnit,
}: {
  sample: WorkoutProxy;
  distanceUnit: LengthUnit;
}): Promise<ExtendedWorkout | null> => {
  try {
    const { workoutActivityType, duration, uuid, startDate, endDate } = sample;
    const rawDistance = await retrieveDistanceFromSample(sample, distanceUnit);

    const distance = normalizeGenericQuantity({ q: rawDistance, unit: distanceUnit });
    const elevation = normalizeElevationMeters({ q: sample.metadata?.['HKElevationAscended'] });
    const humidity = normalizeHumidity({ q: sample.metadata?.['HKWeatherHumidity'] });
    const temperature = normalizeTemperatureC({ q: sample.metadata?.['HKWeatherTemperature'] });
    const averageMETs = normalizeMETs({ q: sample.metadata?.['HKAverageMETs'] });
    const pace = calculatePace(distance, duration);

    const isIndoor = (sample.metadata?.['HKIndoorWorkout'] as boolean) ?? false;
    const timeZone = (sample.metadata?.['HKTimeZone'] as string) ?? 'Unknown';
    const daysAgo = getDaysAgo(startDate);

    return {
      ...sample,
      proxy: sample,
      distance,
      elevation,
      humidity,
      pace,
      temperature,
      averageMETs,
      startDate,
      endDate,
      daysAgo,
      isIndoor,
      uuid,
      workoutActivityType,
      duration,
      timeZone,
      achievements: {
        isAllTimeFastest: false,
        isAllTimeLongest: false,
        isAllTimeFurthest: false,
        isAllTimeHighestElevation: false,
      },
    };
  } catch (error) {
    console.error('Failed to parse workout sample:', error);

    return null;
  }
};
