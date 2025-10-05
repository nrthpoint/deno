import { Ionicons } from '@expo/vector-icons';
import { LengthUnit, Quantity } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { GroupType } from '@/types/Groups';

/**
 * Color profile for theming
 */
export type ColorProfile = {
  primary: string;
  secondary: string;
  gradientStart: string;
  gradientEnd: string;
};

/**
 * Configuration for each grouping type, including both business logic and UI properties
 */
export interface GroupConfig {
  // Core grouping properties
  type: GroupType;
  property: keyof ExtendedWorkout;
  defaultTolerance: number;
  defaultGroupSize: number;
  backgroundColor: string;
  useRange?: boolean;
  useBidirectionalTolerance?: boolean;

  // Business logic functions
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

  // UI properties (merged from UIConfig)
  enabled: boolean;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  /*   tolerance: number; // User-configurable tolerance
  groupSize: number; // User-configurable group size
 */
  // Color properties (merged from tabColors)
  colorProfile: ColorProfile;
}

/**
 * Type for tab option configuration (for backward compatibility)
 */
export type TabOptionConfig = {
  key: GroupType;
  enabled: boolean;
  label: string;
  tolerance: number;
  groupSize: number;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
};
