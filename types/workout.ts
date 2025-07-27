import { Quantity, WorkoutSample } from '@kingstinct/react-native-healthkit';

type HighlightStat = {
  type: 'pace' | 'distance' | 'duration';
  label: string;
  value: string;
};

export type WorkoutGroupWithHighlight = {
  title: string;
  suffix: string;
  rank: number;
  rankSuffix?: string;
  runs: ExtendedWorkout[];
  // Stats for the group
  percentageOfTotalWorkouts: number;
  totalVariation: Quantity;
  totalDistance: Quantity;
  totalDuration: Quantity;
  averagePace: Quantity;
  prettyPace: string;
  // Stats for the highlight run
  stats: HighlightStat[];
  highlight: ExtendedWorkout;
  worst: ExtendedWorkout;
};

export type WorkoutGroupWithHighlightSet = Record<string, WorkoutGroupWithHighlight>;

export type ExtendedWorkout = WorkoutSample & {
  totalDistance: Quantity;
  averagePace: Quantity;
  daysAgo: string;
  prettyPace: string;
};
