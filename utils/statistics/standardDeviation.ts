import { calculateMean } from './mean';

/**
 * Calculates the standard deviation of an array of numbers
 * Uses sample standard deviation (n-1) for better estimation
 * @param values - Array of numeric values
 * @returns The standard deviation, or 0 if array has less than 2 elements
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length < 2) {
    return 0;
  }

  const mean = calculateMean(values);
  const squaredDifferences = values.map((val) => Math.pow(val - mean, 2));
  const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / (values.length - 1);

  return Math.sqrt(variance);
}
