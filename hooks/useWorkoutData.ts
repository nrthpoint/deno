import { LengthUnit } from '@kingstinct/react-native-healthkit';

// Re-export from the new selector hooks for backward compatibility
export { useWorkoutData } from './useWorkoutSelectors';
export type { WorkoutQuery } from '@/context/WorkoutContext';

export type MetaWorkoutData = {
  totalRuns: number;
  totalDistance: { quantity: number; unit: LengthUnit };
};
