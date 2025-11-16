/**
 * Calculates the arithmetic mean (average) of an array of numbers
 * @param values - Array of numeric values
 * @returns The mean value, or 0 if the array is empty
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}
