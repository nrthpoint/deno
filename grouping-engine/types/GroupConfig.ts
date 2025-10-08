import { Ionicons } from '@expo/vector-icons';
import { LengthUnit, Quantity } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { GroupType } from '@/types/Groups';

/**
 * Color profile for theming
 */
export type ColorProfile = {
  gradientEnd: string;
  gradientStart: string;
  primary: string;
  secondary: string;
};

/**
 * Configuration for each grouping type, including both business logic and UI properties
 */
export interface GroupConfig {
  backgroundColor: string;
  colorProfile: ColorProfile;
  defaultGroupSize: number;
  enabled: boolean;
  foregroundColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  property: keyof ExtendedWorkout;
  type: GroupType;
  useRange?: boolean;

  filter?: (sample: ExtendedWorkout) => boolean;
  suffixFormatter: (distanceUnit: LengthUnit) => string;
  titleFormatter?: (params: {
    key: string;
    sample: ExtendedWorkout;
    distanceUnit: LengthUnit;
    groupSize?: number;
  }) => string;
  unitFormatter: (key: string, sample: ExtendedWorkout, distanceUnit: LengthUnit) => string;
  valueExtractor: (sample: ExtendedWorkout) => Quantity;
}

/**
 * Type for tab option configuration (for backward compatibility)
 */
export type TabOptionConfig = {
  key: GroupType;
  enabled: boolean;
  label: string;
  groupSize: number;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
};
