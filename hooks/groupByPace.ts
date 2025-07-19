import { ExtendedWorkout, WorkoutGroupWithHighlightSet } from "@/types/workout";

export const groupRunsByPace = (
  runs: readonly ExtendedWorkout[],
  tolerance = 0.5 // Allow 30 seconds tolerance for pace grouping
): WorkoutGroupWithHighlightSet => {
  const grouped: WorkoutGroupWithHighlightSet = {};

  for (const run of runs) {
    // Check if run has averagePace property
    if (!run.averagePace || !run.totalDistance) {
      continue;
    }

    // Round to nearest whole minute pace (e.g., 7.3 min/mile -> 7 min/mile)
    const nearestMinutePace = Math.round(run.averagePace.quantity);
    const isCloseEnough =
      Math.abs(run.averagePace.quantity - nearestMinutePace) <= tolerance;

    if (!isCloseEnough) {
      console.warn(
        `Run with pace ${run.averagePace} min/mile is not close enough to a whole minute. Skipping.`
      );
      continue;
    }

    if (!grouped[nearestMinutePace]) {
      grouped[nearestMinutePace] = {
        title: `${nearestMinutePace} min/mile`,
        runs: [],
        highlight: run,
      };
    }

    grouped[nearestMinutePace].runs.push(run);

    // Find the longest distance run in this pace group
    const longestRun = grouped[nearestMinutePace].runs.reduce(
      (prev: ExtendedWorkout, curr: ExtendedWorkout) => {
        if (!prev || !curr || !prev.totalDistance || !curr.totalDistance) {
          return prev || curr;
        }

        return prev.totalDistance > curr.totalDistance ? prev : curr;
      }
    );

    grouped[nearestMinutePace].highlight = longestRun;
  }

  return grouped;
};
