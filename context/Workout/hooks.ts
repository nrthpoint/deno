import { useContext } from 'react';

import { WorkoutContext } from './WorkoutProvider';

export const useWorkout = () => {
  const context = useContext(WorkoutContext);

  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }

  return context;
};
