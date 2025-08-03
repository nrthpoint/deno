import {
  ExtendedWorkout,
  WorkoutGroupWithHighlight,
  WorkoutGroupWithHighlightSet,
} from '@/types/workout';

export interface GroupingParameters {
  tolerance?: number; // Tolerance for grouping runs by distance/pace
  groupSize?: number; // Size of groupings (e.g., 0.5 mile increments, 0.5 minute pace increments)
  samples: readonly ExtendedWorkout[];
}

export interface GroupingSampleParserParams {
  sample: ExtendedWorkout;
  groups: WorkoutGroupWithHighlightSet;
  tolerance?: number;
  groupSize?: number;
}

export interface GroupingStatsParams {
  group: WorkoutGroupWithHighlight;
  samples: readonly ExtendedWorkout[];
}
