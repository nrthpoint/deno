/**
 * Utility functions for consistency score color mapping
 */

export interface ColorGradient {
  start: string;
  end: string;
}

/**
 * Gets the gradient colors based on consistency score
 * Maps score ranges to color gradients:
 * - 80-100: Green (high consistency)
 * - 60-79: Light green (medium-high consistency)
 * - 40-59: Yellow/orange (medium consistency)
 * - 20-39: Orange (low-medium consistency)
 * - 0-19: Red (low consistency)
 * @param score - Consistency score (0-100)
 * @returns Object containing start and end gradient colors
 */
export function getConsistencyColors(score: number): ColorGradient {
  if (score >= 80) {
    // High consistency - bright green
    return { start: 'rgba(129, 230, 134, 1)', end: 'rgba(76, 201, 82, 1)' };
  } else if (score >= 60) {
    // Medium-high consistency - bright light green
    return { start: 'rgba(174, 213, 129, 1)', end: 'rgba(139, 195, 74, 1)' };
  } else if (score >= 40) {
    // Medium consistency - bright yellow/orange
    return { start: 'rgba(255, 213, 79, 1)', end: 'rgba(255, 179, 0, 1)' };
  } else if (score >= 20) {
    // Low-medium consistency - bright orange
    return { start: 'rgba(255, 183, 77, 1)', end: 'rgba(255, 152, 0, 1)' };
  } else {
    // Low consistency - bright red
    return { start: 'rgba(255, 138, 128, 1)', end: 'rgba(244, 67, 54, 1)' };
  }
}
