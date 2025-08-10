import { createContext, useContext, useState, ReactNode } from 'react';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

interface WorkoutContextType {
  selectedWorkout: ExtendedWorkout | null;
  setSelectedWorkout: (workout: ExtendedWorkout | null) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [selectedWorkout, setSelectedWorkout] = useState<ExtendedWorkout | null>(null);

  return (
    <WorkoutContext.Provider value={{ selectedWorkout, setSelectedWorkout }}>
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
