import { Quantity, WorkoutSample } from '@kingstinct/react-native-healthkit';

type HighlightStat = {
  type: 'pace' | 'distance' | 'duration';
  label: string;
  value: Quantity;
};

export type WorkoutGroupWithHighlight = {
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
  stats: HighlightStat[];
  highlight: ExtendedWorkout;
  worst: ExtendedWorkout;
  mostRecent: ExtendedWorkout;
};

export type WorkoutGroupWithHighlightSet = Record<string, WorkoutGroupWithHighlight>;

export type ExtendedWorkout = WorkoutSample & {
  totalDistance: Quantity;
  totalElevationAscended?: Quantity;
  humidity?: Quantity;
  averagePace: Quantity;
  daysAgo: string;
  prettyPace: string;
};

export type MetaWorkoutData = {
  totalRuns: number;
  totalDistance: Quantity;
};
