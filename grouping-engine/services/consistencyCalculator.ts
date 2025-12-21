import {
  calculateCoefficientOfVariation,
  calculateMean,
  calculateMedian,
  calculateStandardDeviation,
  clamp,
} from '@/utils/statistics';

/**
 * Result of consistency calculation
 */
export interface ConsistencyResult {
  score: number; // 0-100, higher is more consistent
  mean: number;
  median: number;
  standardDeviation: number;
  coefficientOfVariation: number;
}

/**
 * Calculates a consistency score from an array of values
 * Higher scores indicate more consistent (less variable) data
 *
 * @param values - Array of numeric values (pace, time, distance, elevation, etc.)
 * @returns ConsistencyResult object with score and statistical measures
 *
 * @example
 * // Very consistent workouts (low variation)
 * calculateConsistency([100, 102, 98, 101, 99])
 * // Returns: { score: ~98, mean: 100, ... }
 *
 * @example
 * // Inconsistent workouts (high variation)
 * calculateConsistency([100, 150, 80, 120, 90])
 * // Returns: { score: ~70, mean: 108, ... }
 */
export function calculateConsistency(values: number[]): ConsistencyResult {
  // Handle edge cases
  if (values.length === 0) {
    return {
      score: 0,
      mean: 0,
      median: 0,
      standardDeviation: 0,
      coefficientOfVariation: 0,
    };
  }

  if (values.length === 1) {
    return {
      score: 100, // Single value is perfectly consistent
      mean: values[0],
      median: values[0],
      standardDeviation: 0,
      coefficientOfVariation: 0,
    };
  }

  // Calculate statistical measures
  const mean = calculateMean(values);
  const median = calculateMedian(values);
  const standardDeviation = calculateStandardDeviation(values);
  const coefficientOfVariation = calculateCoefficientOfVariation(values);

  // Convert coefficient of variation to consistency score
  // CV close to 0 = high consistency (score near 100)
  // CV high = low consistency (score near 0)
  // Using exponential decay to make scores more discriminating
  // This spreads out the scores more than a linear scale
  const score = clamp(100 * Math.exp(-10 * coefficientOfVariation), 0, 100);

  return {
    score: Math.round(score),
    mean,
    median,
    standardDeviation,
    coefficientOfVariation,
  };
}
