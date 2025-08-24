import { Quantity } from '@kingstinct/react-native-healthkit';

import { WorkoutAchievements } from '@/types/ExtendedWorkout';
import { formatPace, formatDurationSeparate } from '@/utils/time';

export type DisplayValue = {
  displayValue: string;
  unit: string;
}[];

export const formatQuantityValue = (value: Quantity, type?: string): DisplayValue => {
  if (!value || value.quantity === undefined || value.quantity === null) {
    console.warn('formatQuantityValue: Invalid quantity value');

    return [{ displayValue: '0', unit: value?.unit }];
  }

  switch (type) {
    case 'pace':
      const paceFormattedValue = formatPace(value, false);
      const paceFormattedUnit = value.unit || 'min/mi';

      return [{ displayValue: paceFormattedValue, unit: paceFormattedUnit }];

    case 'duration':
      return formatDurationSeparate(value);

    case 'distance':
    case 'elevation':
      return [
        {
          displayValue: value.quantity.toFixed(2),
          unit: value.unit,
        },
      ];

    default:
      return [
        {
          displayValue: value.quantity.toString(),
          unit: value.unit,
        },
      ];
  }
};

export type AchievementBadge = {
  label: string;
  color: string;
};

export const getAchievementBadge = (achievements: WorkoutAchievements) => {
  // Priority order: Fastest > Furthest > Longest > Highest Elevation > Personal Best
  if (achievements.isAllTimeFastest) {
    return { label: '🏃‍♂️ FASTEST', color: '#FF6B35' };
  }

  if (achievements.isAllTimeFurthest) {
    return { label: '🏁 FURTHEST', color: '#4ECDC4' };
  }

  if (achievements.isAllTimeLongest) {
    return { label: '⏱️ LONGEST', color: '#45B7D1' };
  }

  if (achievements.isAllTimeHighestElevation) {
    return { label: '⛰️ HIGHEST', color: '#96CEB4' };
  }

  return null;
};
