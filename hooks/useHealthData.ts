import { SpeedType } from "@/context/SettingsContext";
import {
  queryWorkoutSamples,
  isProtectedDataAvailable,
  UnitOfLength,
  UnitOfEnergy,
  HKWorkout,
  HKWorkoutActivityType,
  LengthUnit,
} from "@kingstinct/react-native-healthkit";
import { useEffect, useState } from "react";

type RunGroupWithFastest = {
  runs: HKWorkout[];
  fastestRun: HKWorkout;
};

type RunGroupWithFastestSet = Record<number, RunGroupWithFastest>;

export function useGroupedRunData(
  distanceUnit: LengthUnit = UnitOfLength.Miles,
  groupingType: SpeedType
) {
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
        distanceUnit,
        energyUnit: UnitOfEnergy.Kilocalories,
      });

      const runs = data.filter(
        (d) => d.workoutActivityType === HKWorkoutActivityType.running
      );

      const grouped = groupRunsByDistance(runs, groupingType, 0.25);

      setGroupedRuns(grouped);
    };

    fetchRuns();
  }, [distanceUnit, groupingType]);

  return groupedRuns;
}

const groupRunsByDistance = (
  runs: HKWorkout[],
  groupingType: SpeedType,
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
        fastestRun: run,
      };
    }

    grouped[nearestMile].runs.push(run);

    const fastestRun = grouped[nearestMile].runs.reduce((prev, curr) => {
      console.log("Comparing runs:", prev, curr);
      if (!prev || !curr) return prev || curr;

      if (groupingType === "time") {
        return prev.duration < curr.duration ? prev : curr;
      }

      if (groupingType === "pace") {
        const prevPace = getPace(prev);
        const currPace = getPace(curr);

        return prevPace < currPace ? prev : curr;
      }

      return prev;
    });

    grouped[nearestMile].fastestRun = fastestRun;
  }

  return grouped;
};

export const getPace = (run: HKWorkout): number => {
  const distance = run.totalDistance?.quantity;

  if (!distance || distance === 0) return 0;

  const minutes = run.duration / 60;

  return Number((minutes / distance).toFixed(2));
};
