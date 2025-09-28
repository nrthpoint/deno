import { WorkoutQuery } from './types';

export const generateQueryKey = (query: WorkoutQuery): string => {
  return `${query.activityType}-${query.distanceUnit}-${query.timeRangeInDays}`;
};
