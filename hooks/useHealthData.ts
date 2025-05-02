import {
  queryWorkoutSamples,
  isProtectedDataAvailable,
  UnitOfLength,
  UnitOfEnergy,
  HKWorkout,
  HKWorkoutActivityType,
} from "@kingstinct/react-native-healthkit";
import { useEffect, useState } from "react";

export function useGroupedRunData() {
  const [groupedRuns, setGroupedRuns] = useState<RunGroupWithFastestSet | null>(
    null
  );

  useEffect(() => {
    const fetchRuns = async () => {
      const authorized = await isProtectedDataAvailable();

      if (!authorized) {
        console.log("Authorization not granted");
        return;
      }

      const data = await queryWorkoutSamples({
        distanceUnit: UnitOfLength.Miles,
        energyUnit: UnitOfEnergy.Kilocalories,
      });

      const runs = data.filter(
        (d) => d.workoutActivityType === HKWorkoutActivityType.running
      );

      const grouped = groupRunsByDistance(runs, 0.25);

      setGroupedRuns(grouped);
    };

    fetchRuns();
  }, []);

  return groupedRuns;
}

type RunGroupWithFastest = {
  runs: HKWorkout[];
  fastestRun?: HKWorkout;
};

type RunGroupWithFastestSet = Record<number, RunGroupWithFastest>;

const groupRunsByDistance = (
  runs: HKWorkout[],
  tolerance = 0.25
): RunGroupWithFastestSet => {
  const grouped: RunGroupWithFastestSet = {};

  for (const run of runs) {
    const distance = run.totalDistance;

    if (distance === undefined) {
      console.log("Distance is undefined for run:", run);
      continue;
    }

    const nearestMile = Math.round(distance.quantity);
    const isCloseEnough =
      Math.abs(distance.quantity - nearestMile) <= tolerance;

    if (!isCloseEnough) {
      console.log(
        `Distance ${distance.quantity} is not close enough to ${nearestMile} (tolerance: ${tolerance})`
      );
      continue;
    }

    if (!grouped[nearestMile]) {
      grouped[nearestMile] = {
        runs: [],
      };
    }

    grouped[nearestMile].runs.push(run);

    // Find the fastest run in the group
    const fastestRun = grouped[nearestMile].runs.reduce((prev, curr) => {
      if (!prev || !curr) return prev || curr;
      return prev.duration < curr.duration ? prev : curr;
    });

    grouped[nearestMile].fastestRun = fastestRun;
  }

  return grouped;
};
