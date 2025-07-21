import {
  ExtendedWorkout,
  WorkoutGroupWithHighlight,
  WorkoutGroupWithHighlightSet,
} from "@/types/workout";

// TODO: Tolerance needs to be configurable based on distance unit
export const groupRunsByDistance = (
  runs: readonly ExtendedWorkout[],
  tolerance = 0.25
): WorkoutGroupWithHighlightSet => {
  const grouped: WorkoutGroupWithHighlightSet =
    {} as WorkoutGroupWithHighlightSet;

  for (const run of runs) {
    const distance = run.totalDistance;
    const nearestMile = Math.round(distance.quantity);
    const isCloseEnough =
      Math.abs(distance.quantity - nearestMile) <= tolerance;

    if (!isCloseEnough) {
      console.warn(
        `Run with distance ${distance.quantity} is not close enough to a whole number. Skipping.`
      );
      continue;
    }

    if (!grouped[nearestMile]) {
      grouped[nearestMile] = {
        title: `${nearestMile} ${run.totalDistance?.unit}`,
        runs: [],
        highlight: run,
      } satisfies WorkoutGroupWithHighlight;
    }

    grouped[nearestMile].runs.push(run);

    const fastestRun = grouped[nearestMile].runs.reduce((prev, curr) => {
      if (!prev || !curr) {
        return prev || curr;
      }

      // Compare pace values - lower pace is faster
      if (!prev.averagePace || !curr.averagePace) {
        return prev.averagePace ? prev : curr;
      }

      return prev.averagePace.quantity <= curr.averagePace.quantity
        ? prev
        : curr;
    });

    grouped[nearestMile].highlight = fastestRun;
  }

  return grouped;
};
