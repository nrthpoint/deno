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

export function subtractQuantities(a: Quantity, b: Quantity): Quantity {
  if (a.unit !== b.unit) {
    throw new Error(`Unit mismatch: ${a.unit} !== ${b.unit}`);
  }

  const diff = a.quantity - b.quantity;

  if (isNaN(diff) || diff < 0) {
    throw new Error('Resulting quantity must be a valid non-negative number');
  }

  return newQuantity(diff, a.unit);
}

export function getAbsoluteDifference(a: Quantity, b: Quantity): Quantity {
  if (a.unit !== b.unit) {
    throw new Error(`Unit mismatch: ${a.unit} !== ${b.unit}`);
  }

  const diff = Math.abs(a.quantity - b.quantity);

  if (isNaN(diff) || diff < 0) {
    throw new Error('Resulting quantity must be a valid non-negative number');
  }

  return newQuantity(diff, a.unit);
}

export function calculatePercentage(part: number, total: number): number;
export function calculatePercentage(part: Quantity, total: Quantity): number;
export function calculatePercentage(part: number | Quantity, total: number | Quantity): number {
  if (typeof part === 'object' && typeof total === 'object') {
    if (part.unit !== total.unit) {
      throw new Error(`Unit mismatch: ${part.unit} !== ${total.unit}`);
    }

    return calculatePercentage(part.quantity, total.quantity);
  }

  if (typeof total === 'number' && total === 0) {
    return 0;
  }

  const partNum = typeof part === 'number' ? part : part.quantity;
  const totalNum = typeof total === 'number' ? total : total.quantity;

  const percentage = (partNum / totalNum) * 100;

  return parseFloat(percentage.toFixed(2));
}
