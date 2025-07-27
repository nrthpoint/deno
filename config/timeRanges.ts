export type TimeRange = 7 | 30 | 90 | 180 | 365 | 3650; // days

export interface TimeRangeConfig {
  value: TimeRange;
  label: string;
}

export const TIME_RANGE_OPTIONS: TimeRangeConfig[] = [
  { value: 7, label: 'Week' },
  { value: 30, label: 'Month' },
  { value: 90, label: '3 Months' },
  { value: 180, label: '6 Months' },
  { value: 365, label: 'Year' },
  { value: 3650, label: 'All Time' }, // ~10 years
];

// Helper functions for easy access
export const TIME_RANGE_LABELS: Record<TimeRange, string> = TIME_RANGE_OPTIONS.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.label }),
  {} as Record<TimeRange, string>,
);

export const VALID_TIME_RANGES: TimeRange[] = TIME_RANGE_OPTIONS.map((option) => option.value);
