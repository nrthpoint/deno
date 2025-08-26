import { Quantity } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from './ExtendedWorkout';
import { PredictedWorkout } from './Prediction';
import { Stat } from './Stat';

export type GroupType = 'distance' | 'pace' | 'altitude' | 'duration';

export const GROUP_TYPES = {
  Distance: 'distance' as GroupType,
  Pace: 'pace' as GroupType,
  Altitude: 'altitude' as GroupType,
  Duration: 'duration' as GroupType,
};

export type GroupPredictions = {
  prediction4Week: PredictedWorkout | null;
  prediction12Week: PredictedWorkout | null;
  recommendations: string[];
};

export type Group = {
  key: string;
  unit: string;
  title: string;
  suffix: string;
  type: GroupType;

  // Rank of the group based on the number of runs
  rank: number;
  rankLabel: string;

  // Runs in the group
  runs: ExtendedWorkout[];
  skipped: number;

  // Stats for the group
  percentageOfTotalWorkouts: number;

  // Cumulative stats for the group
  totalVariation: Quantity;
  totalDistance: Quantity;
  totalDuration: Quantity;
  totalElevation: Quantity;

  // Averages for the group
  averageHumidity: Quantity;
  averagePace: Quantity;
  averageDuration: Quantity;
  averageElevation: Quantity;
  averageDistance: Quantity;

  // Pretty formatted stats
  prettyPace: string;
  prettyName: string;

  // Factual stats for the group (no predictions)
  stats: Stats;

  // AI predictions and recommendations
  predictions: GroupPredictions;

  // Key workouts
  highlight: ExtendedWorkout;
  worst: ExtendedWorkout;
  mostRecent: ExtendedWorkout;

  // Variance
  variantDistribution: number[];
};

export type Stats = StatGroup[];

export type StatGroup = {
  title: string;
  description?: string;
  items: Stat[];
};

export type Groups = Record<string, Group>;

export type MetaWorkoutData = {
  totalRuns: number;
  totalDistance: Quantity;
};
