/**
 * Utility functions for consistency score color mapping
 */

export interface ColorGradient {
  start: string;
  end: string;
}

/**
 * Gets the background opacity based on consistency score
 * Higher consistency = more opaque background
 * @param score - Consistency score (0-100)
 * @returns Opacity value between 0.3 and 0.8
 */
export function getBackgroundOpacity(score: number): number {
  // Map 0-100 score to 0.3-0.8 opacity
  return 0.3 + (score / 100) * 0.5;
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
    // High consistency - green
    return { start: 'rgba(96, 212, 100, 0.8)', end: 'rgba(54, 174, 60, 0.9)' };
  } else if (score >= 60) {
    // Medium-high consistency - light green
    return { start: 'rgba(139, 195, 74, 0.8)', end: 'rgba(104, 159, 56, 0.9)' };
  } else if (score >= 40) {
    // Medium consistency - yellow/orange
    return { start: 'rgba(255, 193, 7, 0.8)', end: 'rgba(251, 140, 0, 0.9)' };
  } else if (score >= 20) {
    // Low-medium consistency - orange
    return { start: 'rgba(255, 152, 0, 0.8)', end: 'rgba(245, 124, 0, 0.9)' };
  } else {
    // Low consistency - red
    return { start: 'rgba(244, 67, 54, 0.8)', end: 'rgba(211, 47, 47, 0.9)' };
  }
}
