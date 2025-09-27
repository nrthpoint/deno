import { deleteObjects } from '@kingstinct/react-native-healthkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState, ReactNode, useRef } from 'react';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';

interface WorkoutContextType {
  selectedWorkout: ExtendedWorkout | null;
  selectedWorkouts: ExtendedWorkout[];
  setSelectedWorkout: (workout: ExtendedWorkout | null) => void;
  setSelectedWorkouts: (workouts: ExtendedWorkout[]) => void;
  deleteWorkout: (workout: ExtendedWorkout) => Promise<void>;
  setFetchWorkouts: (fetchWorkouts: () => void) => void;
  triggerRefresh: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [selectedWorkout, setSelectedWorkout] = useState<ExtendedWorkout | null>(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState<ExtendedWorkout[]>([]);
  const fetchWorkoutsRef = useRef<(() => void) | null>(null);

  const setFetchWorkouts = (fetchWorkouts: () => void) => {
    fetchWorkoutsRef.current = fetchWorkouts;
  };

  const triggerRefresh = () => {
    if (fetchWorkoutsRef.current) {
      fetchWorkoutsRef.current();
    }
  };

  const deleteWorkout = async (workout: ExtendedWorkout): Promise<void> => {
    try {
      console.log('Attempting to delete workout with id:', workout.uuid);
      const resp = await deleteObjects('HKWorkoutTypeIdentifier', { uuid: workout.uuid });

      console.log('HealthKit delete response:', resp);
      await AsyncStorage.setItem('workoutDataNeedsRefresh', 'true');

      if (selectedWorkout?.uuid === workout.uuid) {
        setSelectedWorkout(null);
      }

      setSelectedWorkouts((prev) => prev.filter((w) => w.uuid !== workout.uuid));

      triggerRefresh();
    } catch (error) {
      console.error('Failed to delete workout:', error);
      throw error;
    }
  };

  return (
    <WorkoutContext.Provider
      value={{
        selectedWorkout,
        selectedWorkouts,
        setSelectedWorkout,
        setSelectedWorkouts,
        deleteWorkout,
        setFetchWorkouts,
        triggerRefresh,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);

  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }

  return context;
};
