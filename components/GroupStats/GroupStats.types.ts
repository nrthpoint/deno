import { ColorProfile } from '@/config/colors';
import { Group, MetaWorkoutData } from '@/types/Groups';

export type TabType = 'stats' | 'predictions' | 'compare';

export interface GroupStatsProps {
  group: Group;
  meta: MetaWorkoutData;
  tabColor: ColorProfile;
}

export interface TabContentProps {
  group: Group;
  meta: MetaWorkoutData;
  tabColor: ColorProfile;
}
