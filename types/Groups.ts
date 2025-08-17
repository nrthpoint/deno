import { Quantity } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from './ExtendedWorkout';
import { PredictedWorkout } from './Prediction';
import { Stat } from './Stat';

export type GroupType = 'distance' | 'pace' | 'altitude';

export const GROUP_TYPES = {
  Distance: 'distance' as GroupType,
  Pace: 'pace' as GroupType,
  Altitude: 'altitude' as GroupType,
};

export type GroupPredictions = {
  prediction4Week: PredictedWorkout | null;
  prediction12Week: PredictedWorkout | null;
  recommendations: string[];
};

export type Group = {
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

  totalVariation: Quantity;
  totalDistance: Quantity;
  totalDuration: Quantity;
  totalElevationAscended: Quantity;

  averageHumidity: Quantity;
  averagePace: Quantity;
  averageDuration: Quantity;

  prettyPace: string;

  // Factual stats for the group (no predictions)
  stats: Stats;
  // AI predictions and recommendations
  predictions: GroupPredictions;
  highlight: ExtendedWorkout;
  worst: ExtendedWorkout;
  mostRecent: ExtendedWorkout;
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
