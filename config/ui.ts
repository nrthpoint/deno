import { Ionicons } from '@expo/vector-icons';

import { TabOption } from '@/components/TabBar/TabBar';
import { GroupType } from '@/types/Groups';

export type TabOptionConfig = {
  key: GroupType;
  enabled: boolean;
  label: string;
  tolerance: number;
  groupSize: number;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
};

type TabOptionsByGroup = {
  [K in GroupType]: TabOptionConfig;
};

/*
 * The base config for the different grouping modes.
 */
export const UIConfig = {
  tabOptions: {
    distance: {
      key: 'distance',
      enabled: true,
      label: 'Distance',
      tolerance: 0,
      groupSize: 1,
      icon: 'walk',
      description: 'Distance run or walked',
    },
    pace: {
      key: 'pace',
      enabled: true,
      label: 'Pace',
      tolerance: 0.5,
      groupSize: 1,
      icon: 'speedometer',
      description: 'Average pace',
    },
    elevation: {
      key: 'elevation',
      enabled: true,
      label: 'Elevation',
      tolerance: 50,
      groupSize: 100,
      icon: 'bar-chart',
      description: 'Elevation climbed',
    },
    duration: {
      key: 'duration',
      enabled: true,
      label: 'Duration',
      tolerance: 5,
      groupSize: 10,
      icon: 'time',
      description: 'Workout duration',
    },
    temperature: {
      key: 'temperature',
      enabled: true,
      label: 'Temperature',
      tolerance: 5,
      groupSize: 10,
      icon: 'thermometer',
      description: 'Temperature during workout',
    },
    humidity: {
      key: 'humidity',
      enabled: true,
      label: 'Humidity',
      tolerance: 5,
      groupSize: 10,
      icon: 'cloud-outline',
      description: 'Humidity during workout',
    },
  } satisfies TabOptionsByGroup,
} as const;

export const getTabOptionConfig = (groupType: GroupType): TabOptionConfig => {
  const result = UIConfig.tabOptions[groupType];

  if (!result) {
    throw new Error(`getTabOptionConfig: No config found for groupType ${groupType}`);
  }

  return result;
};

/*
 * The labels for the tabs used to navigate in the Group Stats
 */
export const groupStatsTabs: TabOption[] = [
  { id: 'stats', label: 'Stats' },
  { id: 'compare', label: 'Compare' },
  { id: 'predictions', label: 'Progression' },
];
