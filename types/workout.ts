import { Quantity, WorkoutSample } from "@kingstinct/react-native-healthkit";

export type WorkoutGroupWithHighlight = {
  title: string;
  runs: ExtendedWorkout[];
  highlight: ExtendedWorkout;
};

export type WorkoutGroupWithHighlightSet = Record<
  number,
  WorkoutGroupWithHighlight
>;

export type ExtendedWorkout = WorkoutSample & {
  totalDistance: number;
  startDate: Date;
  endDate: Date;
  averagePace: Quantity;
};
