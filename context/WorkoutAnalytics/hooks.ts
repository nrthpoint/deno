import { useContext } from 'react';

import { WorkoutAnalyticsContext } from './WorkoutAnalyticsProvider';

export const useWorkoutAnalytics = () => {
  const context = useContext(WorkoutAnalyticsContext);

  if (context === undefined) {
    throw new Error('useWorkoutAnalytics must be used within a WorkoutAnalyticsProvider');
  }

  return context;
};
