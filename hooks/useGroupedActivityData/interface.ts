import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Groups, Group } from '@/types/Groups';

export interface GroupingConfig {
  tolerance: number;
  groupSize: number;
}

export interface GroupingParameters extends GroupingConfig {
  samples: readonly ExtendedWorkout[];
}

export interface IndividualSampleParserParams extends GroupingConfig {
  sample: ExtendedWorkout;
  groups: Groups;
}

export interface GroupingStatsParams {
  group: Group;
  samples: readonly ExtendedWorkout[];
}
