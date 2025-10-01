import { LengthUnit } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group, Groups } from '@/types/Groups';

export interface GroupingConfig {
  enabled?: boolean;
  tolerance: number;
  groupSize: number;
}

export interface GroupingParameters extends GroupingConfig {
  samples: readonly ExtendedWorkout[];
  distanceUnit: LengthUnit;
}

export interface IndividualSampleParserParams extends GroupingConfig {
  sample: ExtendedWorkout;
  groups: Groups;
  distanceUnit: LengthUnit;
}

export interface GroupingStatsParams {
  group: Group;
  samples: readonly ExtendedWorkout[];
}
