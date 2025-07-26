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
import { convertDurationToMinutes } from '@/utils/time';

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

    grouped[nearestMile].runs.push(run);

    // Update total distance and duration for the group
    grouped[nearestMile].totalDistance = sumQuantities([
      grouped[nearestMile].totalDistance,
      run.totalDistance,
    ]);

    grouped[nearestMile].totalDuration = sumQuantities([
      grouped[nearestMile].totalDuration,
      run.duration,
    ]);

    grouped[nearestMile].averagePace = calculatePaceFromDistanceAndDuration(
      grouped[nearestMile].totalDistance,
      grouped[nearestMile].totalDuration,
    );

    grouped[nearestMile].prettyPace = formatPace(grouped[nearestMile].averagePace);

    // Calculate percentage of total workouts
    grouped[nearestMile].percentageOfTotalWorkouts =
      (grouped[nearestMile].runs.length / runs.length) * 100;

    grouped[nearestMile].highlight = findFastestRun(grouped[nearestMile].runs);
    grouped[nearestMile].worst = findSlowestRun(grouped[nearestMile].runs);

    // Calculate the variation in total duration for the group
    const diff =
      grouped[nearestMile].worst.duration.quantity -
      grouped[nearestMile].highlight.duration.quantity;

    const diffQuantity = newQuantity(Math.abs(diff), grouped[nearestMile].totalDuration.unit);

    // Convert totalVariation from seconds to minutes.
    grouped[nearestMile].totalVariation = {
      quantity: convertDurationToMinutes(diffQuantity),
      unit: 'm',
    };
  }

  return grouped;
};
