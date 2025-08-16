import { ColorProfile } from '@/config/colors';
import { GroupType } from '@/types/Groups';

export interface GroupingConfig {
  tolerance: number;
  groupSize: number;
}

export interface GroupingConfigModalProps {
  visible: boolean;
  onDismiss: () => void;
  groupType: GroupType;
  distanceUnit: string;
  config: GroupingConfig;
  onConfigChange: (config: GroupingConfig) => void;
  colorProfile: ColorProfile;
}
