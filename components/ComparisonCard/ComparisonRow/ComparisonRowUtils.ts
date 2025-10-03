import { ComparisonProperty } from '@/components/ComparisonCard/ComparisonCard.types';
import { StatDisplayData } from '@/components/ComparisonCard/ComparisonRow/ComparisonRow';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { formatDuration } from '@/utils/time';

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
      const paceFormatted = workout.pace.formatted;
      const paceMatch = paceFormatted.match(/^(\d+:\d+)\s*(.*)$/);

      if (paceMatch) {
        return {
          displayValue: paceMatch[1],
          unit: paceMatch[2] || workout.pace.unit,
          numericValue: workout.pace.quantity,
        };
      }

      return {
        displayValue: paceFormatted,
        unit: '',
        numericValue: workout.pace.quantity,
      };

    case 'distance':
      const distance = workout.distance;
      return {
        displayValue: distance.formatted,
        unit: distance.unit || '',
        numericValue: distance.quantity,
      };

    case 'elevation':
      const elevation = workout.elevation;

      return {
        displayValue: elevation.formatted,
        unit: elevation.unit,
        numericValue: elevation.quantity,
      };

    case 'humidity':
      const humidity = workout.humidity;

      return {
        displayValue: humidity.formatted,
        unit: humidity.unit,
        numericValue: humidity.quantity,
      };

    case 'temperature':
      const temperature = workout.temperature;

      return {
        displayValue: temperature.formatted,
        unit: temperature.unit,
        numericValue: temperature.quantity,
      };

    default:
      throw new Error(`Unsupported property: ${property}`);
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
    case 'humidity':
      return 'Humidity';
    case 'temperature':
      return 'Temperature';
    default:
      return property;
  }
};
