import { createContext, useContext, ReactNode } from 'react';

interface WorkoutDataRefreshContextType {
  refreshWorkoutData: () => void;
}

const WorkoutDataRefreshContext = createContext<WorkoutDataRefreshContextType | undefined>(
  undefined,
);

export const WorkoutDataRefreshProvider = ({
  children,
  onRefresh,
}: {
  children: ReactNode;
  onRefresh: () => void;
}) => {
  const refreshWorkoutData = () => {
    onRefresh();
  };

  return (
    <WorkoutDataRefreshContext.Provider value={{ refreshWorkoutData }}>
      {children}
    </WorkoutDataRefreshContext.Provider>
  );
};

export const useWorkoutDataRefresh = () => {
  const context = useContext(WorkoutDataRefreshContext);
  if (context === undefined) {
    // Return a no-op function if not in a provider
    return { refreshWorkoutData: () => {} };
  }
  return context;
};
