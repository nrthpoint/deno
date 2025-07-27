import {
  ExtendedWorkout,
  WorkoutGroupWithHighlight,
  WorkoutGroupWithHighlightSet,
} from '@/types/workout';
import { newQuantity, sumQuantities } from '@/utils/quantity';
import {
  calculatePaceFromDistanceAndDuration,
  formatPace,
  findFastestRun,
  findSlowestRun,
} from '@/utils/workout';
import { convertDurationToMinutes, formatDuration } from '@/utils/time';

// TODO: Tolerance needs to be configurable based on distance unit
export const groupRunsByDistance = (
  runs: readonly ExtendedWorkout[],
  tolerance = 0.25,
): WorkoutGroupWithHighlightSet => {
  const grouped: WorkoutGroupWithHighlightSet = {} as WorkoutGroupWithHighlightSet;

  for (const run of runs) {
    const distance = run.totalDistance;
    const nearestMile = Math.round(distance.quantity);
    const isCloseEnough = Math.abs(distance.quantity - nearestMile) <= tolerance;

    if (!isCloseEnough) {
      console.warn(
        `Run with distance ${distance.quantity} is not close enough to a whole number. Skipping.`,
      );
      continue;
    }

    if (!grouped[nearestMile]) {
      grouped[nearestMile] = {
        title: `${nearestMile} ${run.totalDistance?.unit}`,
        suffix: '',
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

    const group = grouped[nearestMile];

    group.runs.push(run);

    group.totalDistance = sumQuantities([group.totalDistance, run.totalDistance]);
    group.totalDuration = sumQuantities([group.totalDuration, run.duration]);
    group.averagePace = calculatePaceFromDistanceAndDuration(
      group.totalDistance,
      group.totalDuration,
    );
    group.prettyPace = formatPace(group.averagePace);
    group.percentageOfTotalWorkouts = (group.runs.length / runs.length) * 100;
    group.highlight = findFastestRun(group.runs);
    group.worst = findSlowestRun(group.runs);

    const diff = group.worst.duration.quantity - group.highlight.duration.quantity;
    const diffQuantity = newQuantity(Math.abs(diff), group.totalDuration.unit);

    group.totalVariation = diffQuantity;

    group.stats = [
      {
        type: 'pace',
        label: 'Average Pace',
        value: group.highlight.prettyPace,
      },
      {
        type: 'distance',
        label: 'Total Distance',
        value: `${group.totalDistance.quantity.toFixed(2)} ${group.totalDistance.unit}`,
      },
      {
        type: 'duration',
        label: 'Total Duration',
        value: formatDuration(group.totalDuration.quantity),
      },
    ];
  }

  return grouped;
};
