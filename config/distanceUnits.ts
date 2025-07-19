import { LengthUnit } from "@kingstinct/react-native-healthkit";

export interface DistanceUnitConfig {
  value: LengthUnit;
  label: string;
  shortLabel: string;
}

export const DISTANCE_UNIT_OPTIONS: DistanceUnitConfig[] = [
  { value: "mi", label: "Miles", shortLabel: "mi" },
  { value: "km", label: "Kilometers", shortLabel: "km" },
  { value: "m", label: "Meters", shortLabel: "m" },
];

// Helper functions for easy access
export const DISTANCE_UNIT_LABELS: Record<LengthUnit, string> =
  DISTANCE_UNIT_OPTIONS.reduce(
    (acc, option) => ({ ...acc, [option.value]: option.label }),
    {} as Record<LengthUnit, string>
  );

export const DISTANCE_UNIT_SHORT_LABELS: Record<LengthUnit, string> =
  DISTANCE_UNIT_OPTIONS.reduce(
    (acc, option) => ({ ...acc, [option.value]: option.shortLabel }),
    {} as Record<LengthUnit, string>
  );

export const VALID_DISTANCE_UNITS: LengthUnit[] = DISTANCE_UNIT_OPTIONS.map(
  (option) => option.value
);
