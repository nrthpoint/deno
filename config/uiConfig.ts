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
    { key: 'pace', enabled: false, label: 'Pace', tolerance: 0.5, groupSize: 1.0 },
    { key: 'distance', enabled: true, label: 'Distance', tolerance: 0.25, groupSize: 1.0 },
    { key: 'altitude', enabled: false, label: 'Altitude', tolerance: 50, groupSize: 100 },
  ],
};

export const getTabOptionConfig = (groupType: GroupType): TabOptionConfig => {
  return (
    defaultUIConfig.tabOptions.find((opt) => opt.key === groupType) ||
      // fallback (shouldn't happen)
      { key: groupType, enabled: false, label: groupType, tolerance: 0.25, groupSize: 1.0 }
  );
};
