import { ComparisonProperty } from '@/components/ComparisonCard/ComparisonCard.types';
import { StatDisplayData } from '@/components/ComparisonCard/ComparisonRow/ComparisonRow';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { formatDuration, formatPace } from '@/utils/time';

export const formatPropertyValue = (
  property: ComparisonProperty,
  workout: ExtendedWorkout,
): StatDisplayData => {
  switch (property) {
    case 'duration':
      const formattedValue = formatDuration(workout.duration);

      return {
        displayValue: `${formattedValue}`,
        unit: 'min',
        numericValue: workout.duration.quantity,
      };

    case 'averagePace':
      const paceFormatted = formatPace(workout.averagePace);
      const paceMatch = paceFormatted.match(/^(\d+:\d+)\s*(.*)$/);

      if (paceMatch) {
        return {
          displayValue: paceMatch[1],
          unit: paceMatch[2] || workout.averagePace.unit,
          numericValue: workout.averagePace.quantity,
        };
      }

      return {
        displayValue: paceFormatted,
        unit: '',
        numericValue: workout.averagePace.quantity,
      };

    case 'distance':
      return {
        displayValue: workout.totalDistance.quantity.toFixed(2),
        unit: workout.totalDistance.unit || '',
        numericValue: workout.totalDistance.quantity,
      };

    case 'elevation':
      // Assuming elevation data might be in workout statistics
      const elevation = workout.totalElevation || { quantity: 0, unit: 'ft' };
      return {
        displayValue: elevation.quantity.toFixed(0),
        unit: elevation.unit || 'ft',
        numericValue: elevation.quantity,
      };

    case 'humidity':
      const humidity = workout.humidity || { quantity: 0, unit: '%' };
      return {
        displayValue: humidity.quantity.toFixed(0),
        unit: humidity.unit || '%',
        numericValue: humidity.quantity,
      };

    default:
      return {
        displayValue: '0',
        unit: '',
        numericValue: 0,
      };
  }
};

export const getPropertyLabel = (property: ComparisonProperty): string => {
  switch (property) {
    case 'duration':
      return 'Duration';
    case 'averagePace':
      return 'Avg. Pace';
    case 'distance':
      return 'Distance';
    case 'elevation':
      return 'Elevation';
    default:
      return property;
  }
};
