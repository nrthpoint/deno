import { Quantity } from '@kingstinct/react-native-healthkit';

/**
 * Formats a pace Quantity (e.g., {quantity: 6.67, unit: "min/mi"}) into a time format string (e.g., "6:40 min/mi")
 * @param pace - The pace as a Quantity object with decimal minutes and unit
 * @returns Formatted pace string in MM:SS UNIT format (e.g., "6:40 min/mi", "7:30 min/km")
 */
export const formatPace = (pace: Quantity, includeUnit: boolean = true): string => {
  if (pace?.quantity === 0) {
    return `0:00 ${pace.unit}`;
  }

  if (!pace?.quantity || isNaN(pace.quantity) || pace.quantity < 0) {
    throw new Error('formatPace: Pace quantity must be a valid non-negative number');
  }

  if (pace.unit !== 'min/mi' && pace.unit !== 'min/km') {
    throw new Error('formatPace: Pace must be in "min/mi" or "min/km" format');
  }

  const minutes = Math.floor(pace.quantity);
  const seconds = Math.round((pace.quantity % 1) * 60);

  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const unitSuffix = pace.unit ? ` ${pace.unit}` : '';

  return !includeUnit ? timeFormatted : `${timeFormatted}${unitSuffix}`;
};

/**
 * Formats a duration in seconds into a human-readable string (e.g., "1hr 30min 15s")
 * @param duration - The duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (duration: Quantity, limit?: number) => {
  if (isNaN(duration.quantity) || duration.quantity < 0) {
    throw new Error('formatDuration: Duration quantity must be a valid non-negative number');
  }

  if (duration.unit !== 's') {
    throw new Error('formatDuration: Duration must be in seconds (unit: "s")');
  }

  const totalSeconds = Math.round(duration.quantity);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const result = [
    hours > 0 ? `${hours}hr` : null,
    minutes > 0 ? `${minutes}min` : null,
    seconds > 0 ? `${seconds}s` : null,
  ]
    .filter(Boolean)
    .join(' ');

  if (!result) {
    return '0sec';
  }

  if (limit && result.split(' ').length > limit) {
    return result.split(' ').slice(0, limit).join(' ') + '';
  }

  return result;
};

/**
 * Formats a duration in seconds into separate values and units for UI display
 * @param duration - The duration in seconds
 * @returns Array of objects with displayValue and unit for each time component
 */
export const formatDurationSeparate = (duration: Quantity) => {
  if (isNaN(duration.quantity) || duration.quantity < 0) {
    throw new Error(
      'formatDurationSeparate: Duration quantity must be a valid non-negative number',
    );
  }

  if (duration.unit !== 's') {
    throw new Error('formatDurationSeparate: Duration must be in seconds (unit: "s")');
  }

  const totalSeconds = Math.round(duration.quantity);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const components = [];

  if (hours > 0) {
    components.push({ displayValue: hours.toString(), unit: 'hr' });
  }

  if (minutes > 0) {
    components.push({ displayValue: minutes.toString(), unit: 'min' });
  }

  if (seconds > 0 || (hours === 0 && minutes === 0)) {
    components.push({ displayValue: seconds.toString(), unit: 's' });
  }

  return components;
};

/**
 * Converts a Quantity duration into minutes, handling different units (m, s, h)
 * @param duration - The duration as a Quantity object
 * @param decimalPlaces - Number of decimal places to round the result (default is 2)
 * @returns Duration in minutes as a number
 */
export const convertDurationToMinutes = (duration: Quantity, decimalPlaces: number = 2): number => {
  if (!duration || !duration.quantity) return 0;

  let result: number;
  switch (duration.unit) {
    case 'm':
      result = duration.quantity;
      break;
    case 's':
      result = duration.quantity / 60;
      break;
    case 'h':
      result = duration.quantity * 60;
      break;
    default:
      console.warn('Unsupported duration unit:', duration.unit);
      result = 0;
  }

  return Number(result.toFixed(decimalPlaces));
};

export const convertDurationToMinutesQuantity = (
  duration: Quantity,
  decimalPlaces: number = 2,
): Quantity => {
  return {
    quantity: convertDurationToMinutes(duration, decimalPlaces),
    unit: 'min',
  };
};

/**
 * Formats a date into a human-readable string (e.g., "Monday, January 1, 2023")
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

/**
 * Formats a time into a human-readable string (e.g., "12:30 PM")
 * @param date - The date to format
 * @returns Formatted time string
 */
export const formatTime = (date: Date) =>
  date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

/**
 * Returns the ordinal representation of a number (e.g., 1st, 2nd, 3rd, 4th)
 * @param n - The number to convert
 * @returns Ordinal string
 */
export const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;

  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const formatWorkoutDate = (date: Date) => {
  const workoutDay = date.getDate();

  return `${date.toLocaleDateString('en-US', { weekday: 'long' })} ${getOrdinal(workoutDay)} ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
};
