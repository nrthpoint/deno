import {
  WorkoutSample,
  Quantity,
  QueryWorkoutSamplesWithAnchorResponse,
} from '@kingstinct/react-native-healthkit';

export type WorkoutProxy = QueryWorkoutSamplesWithAnchorResponse['workouts'][number];

export interface ExtendedWorkout extends WorkoutSample {
  totalDistance: Quantity;
  totalElevation: Quantity;
  humidity: Quantity;
  averagePace: Quantity;
  daysAgo: string;
  prettyPace: string;
  achievements: WorkoutAchievements;
  proxy: WorkoutProxy;
  isIndoor: boolean;
}

export type WorkoutAchievements = {
  isAllTimeFastest: boolean;
  isAllTimeLongest: boolean;
  isAllTimeFurthest: boolean;
  isAllTimeHighestElevation: boolean;
};
