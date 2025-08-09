import { WorkoutAchievements } from '@/types/ExtendedWorkout';
import { formatPace, formatDuration } from '@/utils/time';
import { Quantity } from '@kingstinct/react-native-healthkit';

export const formatQuantityValue = (
  value: Quantity,
  type?: string,
): { displayValue: string; unit?: string } => {
  if (!value || value.quantity === undefined || value.quantity === null) {
    return { displayValue: '0', unit: value?.unit };
  }

  switch (type) {
    case 'pace':
      const paceFormattedValue = formatPace(value, false);
      const paceFormattedUnit = value.unit || 'min/mi';

      return { displayValue: paceFormattedValue, unit: paceFormattedUnit };

    case 'duration':
      return { displayValue: formatDuration(value) };

    case 'distance':
      return {
        displayValue: value.quantity.toFixed(2),
        unit: value.unit,
      };

    default:
      return {
        displayValue: value.quantity.toString(),
        unit: value.unit,
      };
  }
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

  if (achievements.isPersonalBestPace && !achievements.isAllTimeFastest) {
    return { label: '⚡ PB PACE', color: '#FECA57' };
  }

  return null;
};
