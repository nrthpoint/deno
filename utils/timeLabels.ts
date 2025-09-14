import { TimeRange, TIME_RANGE_LABELS } from '@/config/timeRanges';

/**
 * Generates a time label based on the duration setting
 * @param timeRangeInDays - The time range in days from settings
 * @returns A formatted time label (e.g., "in the last week", "in the last 3 months")
 */
export function generateTimeLabel(timeRangeInDays: TimeRange): string {
  const label = TIME_RANGE_LABELS[timeRangeInDays];

  if (timeRangeInDays === 3650) {
    // All Time
    return 'of all time';
  }

  return `in the last ${label.toLowerCase()}`;
}
