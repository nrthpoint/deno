import { calculateMean } from './mean';
import { calculateStandardDeviation } from './standardDeviation';

/**
 * Calculates the coefficient of variation (CV)
 * CV = standard deviation / mean
 * A measure of relative variability
 * @param values - Array of numeric values
 * @returns The coefficient of variation, or 0 if mean is 0 or array is invalid
 */
export function calculateCoefficientOfVariation(values: number[]): number {
  if (values.length < 2) {
    return 0;
  }

  const mean = calculateMean(values);
  if (mean === 0) {
    return 0;
  }

  const standardDeviation = calculateStandardDeviation(values);
  return standardDeviation / mean;
}
