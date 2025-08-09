import { Quantity } from '@kingstinct/react-native-healthkit';
import { ExtendedWorkout } from './ExtendedWorkout';
import { Stat } from './Stat';

export type GroupType = 'distance' | 'pace' | 'altitude';

export const GROUP_TYPES = {
  Distance: 'distance' as GroupType,
  Pace: 'pace' as GroupType,
  Altitude: 'altitude' as GroupType,
};

export type Group = {
  title: string;
  suffix: string;

  // Rank of the group based on the number of runs
  rank: number;
  rankLabel: string;

  // Runs in the group
  runs: ExtendedWorkout[];

  // Stats for the group
  percentageOfTotalWorkouts: number;
  totalVariation: Quantity;
  totalDistance: Quantity;
  totalDuration: Quantity;
  totalElevationAscended: Quantity;
  averageHumidity: Quantity;
  averagePace: Quantity;
  prettyPace: string;

  // Stats for the highlight run
  stats: Stat[];
  highlight: ExtendedWorkout;
  worst: ExtendedWorkout;
  mostRecent: ExtendedWorkout;
};

export type Groups = Record<string, Group>;

export type MetaWorkoutData = {
  totalRuns: number;
  totalDistance: Quantity;
};
