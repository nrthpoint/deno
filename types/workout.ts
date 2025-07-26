import { Quantity, WorkoutSample } from '@kingstinct/react-native-healthkit';

type HightlightStat = {
  title: string;
  type: 'pace' | 'distance' | 'duration';
  value: string;
  unit: string;
};

export type WorkoutGroupWithHighlight = {
  title: string;
  runs: ExtendedWorkout[];
  // Stats for the group
  percentageOfTotalWorkouts: number;
  totalVariation: Quantity;
  totalDistance: Quantity;
  totalDuration: Quantity;
  averagePace: Quantity;
  prettyPace: string;
  // Stats for the highlight run
  stats: HightlightStat[];
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
