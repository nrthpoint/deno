import { LengthUnit, Quantity } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { GroupType } from '@/types/Groups';

/**
 * Configuration for each grouping type
 */
export interface GroupConfig {
  type: GroupType;
  property: keyof ExtendedWorkout;
  defaultTolerance: number;
  defaultGroupSize: number;
  unitFormatter: (key: string, sample: ExtendedWorkout, distanceUnit: LengthUnit) => string;
  titleFormatter: (key: string, sample: ExtendedWorkout, distanceUnit: LengthUnit) => string;
  suffixFormatter: (distanceUnit: LengthUnit) => string;
  valueExtractor: (sample: ExtendedWorkout) => Quantity;
  filter?: (sample: ExtendedWorkout) => boolean;
}
