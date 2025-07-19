import { Quantity, WorkoutSample } from "@kingstinct/react-native-healthkit";
import { convertDurationToMinutes } from "./time";

export const calculatePace = (run: WorkoutSample): Quantity => {
  const distance = run.totalDistance?.quantity;
  const distanceUnit = run.totalDistance?.unit;
  const durationMinutes = convertDurationToMinutes(run.duration);

  const result = {
    unit: "min/" + distanceUnit,
    quantity: 0,
  };

  if (!distance || distance === 0) return result;

  result.quantity = Number((durationMinutes / distance).toFixed(2));

  return result;
};
