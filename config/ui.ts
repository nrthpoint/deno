import { TabOption } from '@/components/TabBar/TabBar';
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

/*
 * The base config for the different grouping modes.
 */
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

/*
 * The labels for the tabs in the Grouping Modal to switch Group mode
 */
export const tabLabels: Record<GroupType, string> = defaultUIConfig.tabOptions.reduce(
  (acc, option) => {
    acc[option.key] = option.label;
    return acc;
  },
  {} as Record<GroupType, string>,
);

/*
 * The labels for the tabs used to navigate in the Group Stats
 */
export const groupStatsTabs: TabOption[] = [
  { id: 'stats', label: 'Stats' },
  { id: 'compare', label: 'Compare' },
  { id: 'predictions', label: 'Predictions' },
];
