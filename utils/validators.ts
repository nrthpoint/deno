import { WorkoutActivityType } from '@kingstinct/react-native-healthkit';

export const validateWorkoutActivityType = (value: string): WorkoutActivityType | null => {
  const validValues = Object.values(WorkoutActivityType) as string[];

  if (validValues.includes(value)) {
    return value as unknown as WorkoutActivityType;
  }

  return null;
};
