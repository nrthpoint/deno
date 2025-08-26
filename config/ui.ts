import { GroupType } from '@/types/Groups';

export type TabOptionConfig = {
  key: GroupType;
  enabled: boolean;
  label: string;
  tolerance: number;
  groupSize: number;
};

export type UIConfig = {
  tabOptions: TabOptionConfig[];
};

export const defaultUIConfig: UIConfig = {
  tabOptions: [
    { key: 'distance', enabled: true, label: 'Distance', tolerance: 0.25, groupSize: 1.0 },
    { key: 'pace', enabled: true, label: 'Pace', tolerance: 0.5, groupSize: 1.0 },
    { key: 'altitude', enabled: false, label: 'Altitude', tolerance: 50, groupSize: 100 },
    { key: 'duration', enabled: true, label: 'Duration', tolerance: 5, groupSize: 10 },
  ],
};

export const getTabOptionConfig = (groupType: GroupType): TabOptionConfig => {
  const result = defaultUIConfig.tabOptions.find((opt) => opt.key === groupType);

  if (!result) {
    throw new Error(`getTabOptionConfig: No config found for groupType ${groupType}`);
  }

  return result;
};
