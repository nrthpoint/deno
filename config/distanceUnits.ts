import { LengthUnit } from '@kingstinct/react-native-healthkit';

export interface DistanceUnitConfig {
  value: LengthUnit;
  label: string;
  shortLabel: string;
  enabled?: boolean;
}

export const DISTANCE_UNIT_OPTIONS: DistanceUnitConfig[] = [
  { value: 'mi', label: 'Miles', shortLabel: 'mi', enabled: true },
  { value: 'km', label: 'Kilometers', shortLabel: 'km', enabled: true },
  { value: 'm', label: 'Meters', shortLabel: 'm', enabled: false },
];

// Helper functions for easy access
export const DISTANCE_UNIT_LABELS: Record<LengthUnit, string> = DISTANCE_UNIT_OPTIONS.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.label }),
  {} as Record<LengthUnit, string>,
);

export const DISTANCE_UNIT_SHORT_LABELS: Record<LengthUnit, string> = DISTANCE_UNIT_OPTIONS.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.shortLabel }),
  {} as Record<LengthUnit, string>,
);
