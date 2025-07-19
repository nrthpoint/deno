import { ExtendedWorkout, WorkoutGroupWithHighlightSet } from "@/types/workout";
import { metersToKilometers, metersToMiles } from "@/utils/distance";
import { calculatePace } from "@/utils/workout";
import {
  isProtectedDataAvailable,
  LengthUnit,
  queryWorkoutSamples,
  WorkoutActivityType,
} from "@kingstinct/react-native-healthkit";
import { useEffect, useState } from "react";
import { groupRunsByDistance } from "./groupByDistance";
import { groupRunsByPace } from "./groupByPace";

export type GroupType = "distance" | "pace" | "weather";
export const GROUP_TYPES = {
  Distance: "distance" as GroupType,
  Pace: "pace" as GroupType,
  Weather: "weather" as GroupType,
};

type UseGroupedActivityDataParams = {
  activityType?: WorkoutActivityType;
  distanceUnit?: LengthUnit;
  timeRangeInDays?: number;
  groupType?: GroupType;
};

export function useGroupedActivityData({
  activityType = WorkoutActivityType.running,
  distanceUnit = "mi",
  timeRangeInDays = 365,
  groupType = GROUP_TYPES.Distance,
}: UseGroupedActivityDataParams = {}) {
  const [groups, setGroups] = useState<WorkoutGroupWithHighlightSet | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        setLoading(true);
        const authorized = await isProtectedDataAvailable();

        if (!authorized) {
          console.log("Authorization not granted");
          setLoading(false);
          return;
        }

        const startDate = new Date(
          Date.now() - timeRangeInDays * 24 * 60 * 60 * 1000
        );
        const endDate = new Date();

        // TODO: Filtering by activity type is not working as expected
        const runs = await queryWorkoutSamples({
          ascending: false,
          limit: 10000,
          filter: {
            startDate,
            endDate,
          },
        });

        console.log("Fetched runs:", runs.length);

        const convertedRuns = runs
          .map((run) => {
            if (
              run.workoutActivityType !== activityType ||
              !run.totalDistance ||
              !run.totalDistance.quantity
            ) {
              return null;
            }

            // Create deep copy to avoid mutation issues with Proxy
            const plainRun = JSON.parse(JSON.stringify(run));

            // Convert distance to miles if necessary. Assume default is meters.
            let totalDistance;

            if (distanceUnit === "mi") {
              totalDistance = metersToMiles(plainRun.totalDistance);
            } else if (distanceUnit === "km") {
              totalDistance = metersToKilometers(plainRun.totalDistance);
            } else {
              totalDistance = plainRun.totalDistance;
            }

            const startDate = new Date(plainRun.startDate);
            const endDate = new Date(plainRun.endDate);

            const newRun = {
              ...plainRun,
              totalDistance,
              startDate,
              endDate,
            } satisfies ExtendedWorkout;

            // Calculate average pace
            const averagePace = calculatePace(newRun);

            return {
              ...newRun,
              averagePace,
            };
          })
          .filter((run) => run !== null) as ExtendedWorkout[];

        if (convertedRuns.length === 0) {
          setGroups(null);
          setLoading(false);
          return;
        }

        switch (groupType) {
          case GROUP_TYPES.Distance:
            setGroups(groupRunsByDistance(convertedRuns));
            break;
          case GROUP_TYPES.Pace:
            setGroups(groupRunsByPace(convertedRuns));
            break;
          case GROUP_TYPES.Weather:
            // Implement grouping by weather if needed
            // setGroups(groupRunsByDistance(convertedRuns, 0.5)); // Example tolerance
            break;
          default:
            setGroups(groupRunsByDistance(convertedRuns));
            break;
        }
      } catch (error) {
        console.error("Error fetching runs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, [distanceUnit, timeRangeInDays, groupType, activityType]);

  return { groups, loading };
}
