import {
  ExtendedWorkout,
  WorkoutGroupWithHighlight,
  WorkoutGroupWithHighlightSet,
} from '@/types/workout';
import { newQuantity, sumQuantities } from '@/utils/quantity';
import { findLongestRun, findShortestRun } from '@/utils/workout';

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
        suffix: "'",
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

    const group = grouped[nearestMinutePace];

    group.runs.push(run);

    group.totalDistance = sumQuantities([group.totalDistance, run.totalDistance]);
    group.totalDuration = sumQuantities([group.totalDuration, run.duration]);
    group.percentageOfTotalWorkouts = (group.runs.length / runs.length) * 100;
    group.highlight = findLongestRun(group.runs);
    group.worst = findShortestRun(group.runs);

    const diffInDistance = Math.abs(
      group.highlight.totalDistance.quantity - group.worst.totalDistance.quantity,
    );
    group.totalVariation = newQuantity(diffInDistance, group.highlight.totalDistance.unit);

    // Stats for time and distance of highlight run
    group.stats = [
      {
        type: 'pace',
        label: 'Average Pace',
        value: group.highlight.prettyPace,
      },
      {
        type: 'distance',
        label: 'Total Distance',
        value: `${group.highlight.totalDistance.quantity.toFixed(2)} ${group.highlight.totalDistance.unit}`,
      },
      {
        type: 'duration',
        label: 'Total Duration',
        value: `${group.highlight.duration.quantity.toFixed(2)} ${group.highlight.duration.unit}`,
      },
    ];
  }

  return grouped;
};
