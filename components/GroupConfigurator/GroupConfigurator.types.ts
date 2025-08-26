import { GroupingConfig } from '@/grouping-engine/types/Grouping';
import { GroupType } from '@/types/Groups';

export interface GroupingConfigModalProps {
  visible: boolean;
  groupType: GroupType;
  distanceUnit: string;
  config: GroupingConfig;
  onDismiss: () => void;
  onConfigChange: (config: GroupingConfig) => void;
  onGroupTypeChange: (groupType: GroupType) => void;
}
