import { Quantity } from '@kingstinct/react-native-healthkit';

export function newQuantity(quantity = 0, unit: string = 'mi'): Quantity {
  if (isNaN(quantity) || quantity < 0) {
    throw new Error('Invalid quantity value');
  }

  return { quantity, unit };
}

export function copyQuantity(quantity: Quantity): Quantity {
  if (!quantity || !quantity.quantity || isNaN(quantity.quantity)) {
    throw new Error('Invalid quantity object');
  }

  return { quantity: quantity.quantity, unit: quantity.unit };
}

export function formatQuantity(quantity: Quantity): string {
  if (!quantity || !quantity.quantity || isNaN(quantity.quantity)) {
    throw new Error('Invalid quantity object');
  }

  return `${quantity.quantity} ${quantity.unit}`;
}

export function sumQuantities(quantities: Quantity[]): Quantity {
  if (!quantities || quantities.length === 0) {
    throw new Error('No quantities to sum');
  }

  // Throw an error if units do not match
  const firstUnit = quantities[0].unit;

  for (const q of quantities) {
    if (q.unit !== firstUnit) {
      throw new Error(`Unit mismatch: ${q.unit} !== ${firstUnit}`);
    }
  }

  const total = quantities.reduce((acc, q) => acc + (q.quantity || 0), 0);
  return newQuantity(total, quantities[0].unit);
}

export function averageQuantity(quantities: Quantity[]): Quantity {
  if (!quantities || quantities.length === 0) {
    throw new Error('No quantities to average');
  }

  const total = sumQuantities(quantities);
  return newQuantity(total.quantity / quantities.length, total.unit);
}
