import {
  WorkoutSample,
  QueryWorkoutSamplesWithAnchorResponse,
} from '@kingstinct/react-native-healthkit';

import { QuantityWithFormat } from '@/utils/quantity';

export type WorkoutProxy = QueryWorkoutSamplesWithAnchorResponse['workouts'][number];

export interface ExtendedWorkout extends WorkoutSample {
  distance: QuantityWithFormat;
  elevation: QuantityWithFormat;
  humidity: QuantityWithFormat;
  pace: QuantityWithFormat;
  temperature: QuantityWithFormat;
  averageMETs: QuantityWithFormat;
  daysAgo: string;
  achievements: WorkoutAchievements;
  proxy: WorkoutProxy;
  isIndoor: boolean;
  timeZone: string;
}

export type WorkoutAchievements = {
  isAllTimeFastest: boolean;
  isAllTimeLongest: boolean;
  isAllTimeFurthest: boolean;
  isAllTimeHighestElevation: boolean;
};
