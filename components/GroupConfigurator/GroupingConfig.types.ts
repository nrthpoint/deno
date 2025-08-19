import { ColorProfile } from '@/config/colors';
import { GroupingConfig } from '@/hooks/useGroupedActivityData/interface';
import { GroupType } from '@/types/Groups';

export interface GroupingConfigModalProps {
  visible: boolean;
  onDismiss: () => void;
  groupType: GroupType;
  distanceUnit: string;
  config: GroupingConfig;
  onConfigChange: (config: GroupingConfig) => void;
  colorProfile: ColorProfile;
}
