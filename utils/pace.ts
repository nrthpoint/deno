import { Quantity } from '@kingstinct/react-native-healthkit';

import { QuantityWithFormat } from '@/utils/quantity';
import { convertDurationToMinutes } from '@/utils/time';

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
 * Calculates the pace from a workout sample in minutes.
 * @param run - The workout sample containing total distance and duration.
 * @returns The pace as a Quantity object with unit and quantity.
 */
export const calculatePace = (distance: Quantity, duration: Quantity): QuantityWithFormat => {
  const distanceValue = distance?.quantity;
  const durationValue = duration?.quantity;
  const distanceUnit = distance?.unit;

  if (!distanceValue || distanceValue === 0 || !durationValue || durationValue === 0) {
    return {
      quantity: 0,
      unit: `min/${distanceUnit}`,
      formatted: `0 min/${distanceUnit}`,
    };
  }

  const durationMinutes = convertDurationToMinutes(duration);
  const paceQuantity = (durationMinutes / distanceValue).toFixed(2);

  const pace = {
    unit: `min/${distanceUnit}`,
    quantity: Number(paceQuantity),
  };

  const formatted = formatPace(pace);

  return { ...pace, formatted };
};
