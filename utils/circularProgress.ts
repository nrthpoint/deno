/**
 * Utility functions for circular progress calculations
 */

/**
 * Creates a full circle SVG path
 * @param center - The center point of the circle
 * @param radius - The radius of the circle
 * @param strokeWidth - The width of the stroke
 * @returns SVG path string for a complete circle
 */
export function createCirclePath(center: number, radius: number, strokeWidth: number): string {
  return `
    M ${center} ${strokeWidth / 2}
    A ${radius} ${radius} 0 1 1 ${center} ${center * 2 - strokeWidth / 2}
    A ${radius} ${radius} 0 1 1 ${center} ${strokeWidth / 2}
  `;
}

/**
 * Creates an animated progress arc path based on percentage
 * @param percentage - Progress percentage (0-100)
 * @param center - The center point of the circle
 * @param radius - The radius of the circle
 * @param strokeWidth - The width of the stroke
 * @returns SVG path string for the progress arc
 */
export function createProgressPath(
  percentage: number,
  center: number,
  radius: number,
  strokeWidth: number,
): string {
  'worklet';
  // Cap at 99.9% to avoid completing a full circle (which would result in no visible arc)
  const cappedPercentage = Math.min(percentage, 99.9);
  const progressAngleDeg = (cappedPercentage / 100) * 360;
  const progressAngleRad = (progressAngleDeg * Math.PI) / 180;

  // Start at top of circle (12 o'clock position)
  const startX = center;
  const startY = strokeWidth / 2;

  // Calculate end point based on progress
  const endX = center + radius * Math.sin(progressAngleRad);
  const endY = center - radius * Math.cos(progressAngleRad);

  const largeArcFlag = progressAngleDeg > 180 ? 1 : 0;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
}
