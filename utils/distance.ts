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

export function convertDistanceToUnit(quantity: Quantity, desiredUnit: string): Quantity {
  if (quantity.unit === desiredUnit) {
    return { ...quantity };
  }

  const newQuantity = { ...quantity };
  newQuantity.unit = desiredUnit;

  // Convert from source unit to meters first, then to desired unit
  let metersValue: number;

  // Convert to meters
  switch (quantity.unit) {
    case 'm':
      metersValue = quantity.quantity;
      break;
    case 'km':
      metersValue = quantity.quantity * 1000;
      break;
    case 'mi':
      metersValue = quantity.quantity / 0.000621371;
      break;
    default:
      throw new Error(`Unsupported source unit: ${quantity.unit}`);
  }

  // Convert from meters to desired unit
  switch (desiredUnit) {
    case 'm':
      newQuantity.quantity = metersValue;
      break;
    case 'km':
      newQuantity.quantity = metersValue / 1000;
      break;
    case 'mi':
      newQuantity.quantity = metersValue * 0.000621371;
      break;
    default:
      throw new Error(`Unsupported target unit: ${desiredUnit}`);
  }

  return newQuantity;
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
