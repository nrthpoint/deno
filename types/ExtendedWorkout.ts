import {
  WorkoutSample,
  Quantity,
  WorkoutPlan,
  WorkoutRoute,
} from '@kingstinct/react-native-healthkit';

export interface ExtendedWorkout extends WorkoutSample {
  totalDistance: Quantity;
  totalElevationAscended: Quantity;
  humidity: Quantity;
  averagePace: Quantity;
  daysAgo: string;
  prettyPace: string;
  achievements: WorkoutAchievements;
  plan: WorkoutPlan;
  route: WorkoutRoute;
}

export type WorkoutAchievements = {
  isAllTimeFastest: boolean;
  isAllTimeLongest: boolean;
  isAllTimeFurthest: boolean;
  isAllTimeHighestElevation: boolean;
};
