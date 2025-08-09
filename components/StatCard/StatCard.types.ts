import { Stat } from '@/types/Stat';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export interface StatCardProps {
  stat: Stat;
  groupWorkouts?: ExtendedWorkout[];
  groupTitle?: string;
}
