import React, { createContext, useContext, ReactNode } from 'react';

import { TimeRange } from '@/config/timeRanges';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group, GroupType, MetaWorkoutData } from '@/types/Groups';

interface GroupStatsContextType {
  group: Group;
  meta: MetaWorkoutData;
  allWorkouts: ExtendedWorkout[];
  groupType: GroupType;
  timeRangeInDays: TimeRange;
}

const GroupStatsContext = createContext<GroupStatsContextType | undefined>(undefined);

interface GroupStatsProviderProps {
  children: ReactNode;
  group: Group;
  meta: MetaWorkoutData;
  allWorkouts: ExtendedWorkout[];
  groupType: GroupType;
  timeRangeInDays: TimeRange;
}

export const GroupStatsProvider: React.FC<GroupStatsProviderProps> = ({
  children,
  group,
  meta,
  allWorkouts,
  groupType,
  timeRangeInDays,
}) => {
  const value: GroupStatsContextType = {
    group,
    meta,
    allWorkouts,
    groupType,
    timeRangeInDays,
  };

  return <GroupStatsContext.Provider value={value}>{children}</GroupStatsContext.Provider>;
};

export const useGroupStats = (): GroupStatsContextType => {
  const context = useContext(GroupStatsContext);
  if (context === undefined) {
    throw new Error('useGroupStats must be used within a GroupStatsProvider');
  }
  return context;
};
