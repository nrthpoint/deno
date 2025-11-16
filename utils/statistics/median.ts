/**
 * Calculates the median value of an array of numbers
 * @param values - Array of numeric values
 * @returns The median value, or 0 if the array is empty
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    // Even number of values - return average of two middle values
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    // Odd number of values - return middle value
    return sorted[middle];
  }
}
