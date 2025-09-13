import { Quantity } from '@kingstinct/react-native-healthkit';

export function metersToMiles(m: Quantity): Quantity {
  const newUnit = {
    ...m,
  };

  newUnit.unit = 'mi';
  newUnit.quantity = m.quantity * 0.000621371; // Convert meters to miles

  return newUnit;
}

export function metersToKilometers(m: Quantity): Quantity {
  const newUnit = {
    ...m,
  };

  newUnit.unit = 'km';
  newUnit.quantity = m.quantity / 1000; // Convert meters to kilometers

  return newUnit;
}

export function convertShortUnitToLong({
  unit,
  amount = 1,
}: {
  unit: string;
  amount?: number;
}): string {
  // use amount to determine pluralization
  if (amount !== 1) {
    switch (unit) {
      case 'm':
        return 'meters';
      case 'km':
        return 'kilometers';
      case 'mi':
        return 'miles';
      default:
        return unit;
    }
  }

  // Singular
  switch (unit) {
    case 'm':
      return 'meter';
    case 'km':
      return 'kilometer';
    case 'mi':
      return 'mile';
    default:
      return unit;
  }
}

/**
 * Formats a distance quantity into a human-readable string (e.g., "5.2 km", "3.1 mi")
 * @param distance - The distance as a Quantity object
 * @param decimalPlaces - Number of decimal places to show (default is 1)
 * @returns Formatted distance string
 */
export const formatDistance = (distance: Quantity, decimalPlaces: number = 1): string => {
  if (!distance || !distance.quantity || isNaN(distance.quantity) || distance.quantity < 0) {
    return '0 m';
  }

  const value = distance.quantity.toFixed(decimalPlaces);
  const unit = distance.unit || 'm';

  return `${value} ${unit}`;
};
