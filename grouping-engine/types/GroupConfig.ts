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
  backgroundColor: string;
  useRange?: boolean;
  useBidirectionalTolerance?: boolean;
  unitFormatter: (key: string, sample: ExtendedWorkout, distanceUnit: LengthUnit) => string;
  titleFormatter?: (params: {
    key: string;
    sample: ExtendedWorkout;
    distanceUnit: LengthUnit;
    groupSize?: number;
    useBidirectionalTolerance?: boolean;
  }) => string;
  suffixFormatter: (distanceUnit: LengthUnit) => string;
  valueExtractor: (sample: ExtendedWorkout) => Quantity;
  filter?: (sample: ExtendedWorkout) => boolean;
}
