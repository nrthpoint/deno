import {
  ExtendedWorkout,
  WorkoutGroupWithHighlight,
  WorkoutGroupWithHighlightSet,
} from '@/types/workout';
import { newQuantity } from '@/utils/quantity';
import { findLongestRun } from '@/utils/workout';

export const groupRunsByPace = (
  runs: readonly ExtendedWorkout[],
  tolerance = 0.5, // Allow 30 seconds tolerance for pace grouping
): WorkoutGroupWithHighlightSet => {
  const grouped: WorkoutGroupWithHighlightSet = {};

  for (const run of runs) {
    // Check if run has averagePace property
    if (!run.averagePace || !run.totalDistance) {
      continue;
    }

    // Round to nearest whole minute pace (e.g., 7.3 min/mile -> 7 min/mile)
    const nearestMinutePace = Math.round(run.averagePace.quantity);
    const isCloseEnough = Math.abs(run.averagePace.quantity - nearestMinutePace) <= tolerance;

    if (!isCloseEnough) {
      console.warn(
        `Run with pace ${run.averagePace.quantity} min/mile is not close enough to a whole minute. Skipping.`,
      );
      continue;
    }

    if (!grouped[nearestMinutePace]) {
      grouped[nearestMinutePace] = {
        title: `${nearestMinutePace} min/mile`,
        runs: [],
        highlight: run,
        worst: run,
        percentageOfTotalWorkouts: 0,
        totalVariation: newQuantity(0, 's'),
        totalDistance: newQuantity(0, 'mi'),
        totalDuration: newQuantity(0, 's'),
        averagePace: newQuantity(0, 'min/mile'),
        prettyPace: '',
        stats: [],
      } satisfies WorkoutGroupWithHighlight;
    }

    grouped[nearestMinutePace].runs.push(run);
    grouped[nearestMinutePace].highlight = findLongestRun(grouped[nearestMinutePace].runs);
  }

  return grouped;
};
