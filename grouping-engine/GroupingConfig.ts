import { TabOption } from '@/components/TabBar/TabBar';
import { GroupConfig } from '@/grouping-engine/types/GroupConfig';
import { GroupType } from '@/types/Groups';
import { convertDurationToMinutesQuantity } from '@/utils/time';

/**
 * Registry of all available grouping configurations
 */
export const GROUPING_CONFIGS: Record<GroupType, GroupConfig> = {
  distance: {
    type: 'distance',
    property: 'distance',
    defaultTolerance: 0.5,
    defaultGroupSize: 1.0,
    backgroundColor: '#5681FE',
    unitFormatter: (_key, { distance }) => distance?.unit,
    suffixFormatter: (distanceUnit) => distanceUnit,
    valueExtractor: ({ distance }) => distance,
    // UI properties (merged from UIConfig)
    enabled: true,
    label: 'Distance',
    /*     tolerance: 0,
    groupSize: 1, */
    icon: 'walk',
    description: 'Distance run or walked',
    // Color properties
    colorProfile: {
      primary: '#5681FE',
      secondary: '#4566CB',
      gradientStart: '#6291FF',
      gradientEnd: '#4F75E5',
    },
  },
  pace: {
    type: 'pace',
    property: 'pace',
    defaultTolerance: 0.25,
    defaultGroupSize: 0.5,
    backgroundColor: '#5c96eb',
    unitFormatter: () => 'min/mile',
    titleFormatter: ({ key }) => `${key}`,
    suffixFormatter: () => 'min/mile',
    valueExtractor: ({ pace }) => pace,
    // UI properties (merged from UIConfig)
    enabled: true,
    label: 'Pace',
    /*     tolerance: 0.25,
    groupSize: 0.5, */
    icon: 'speedometer',
    description: 'Average pace',
    // Color properties
    colorProfile: {
      primary: '#5c96eb',
      secondary: '#4A78BC',
      gradientStart: '#6FA5FF',
      gradientEnd: '#5287D4',
    },
  },
  elevation: {
    type: 'elevation',
    property: 'elevation',
    defaultTolerance: 50,
    defaultGroupSize: 100,
    backgroundColor: '#6283f7',
    useRange: true,
    unitFormatter: () => 'meters',
    titleFormatter: ({ key, groupSize }) => {
      if (groupSize) {
        const start = Number(key);
        const end = start + groupSize;

        return `${start}-${end}`;
      }

      return `${key}`;
    },
    suffixFormatter: () => 'm',
    valueExtractor: ({ elevation }) => elevation,
    filter: (sample) => sample.elevation && sample.elevation.quantity > 0,
    // UI properties (merged from UIConfig)
    enabled: true,
    label: 'Elevation',
    /*     tolerance: 50,
    groupSize: 100, */
    icon: 'bar-chart',
    description: 'Elevation climbed',
    // Color properties
    colorProfile: {
      primary: '#6283f7',
      secondary: '#4E69C5',
      gradientStart: '#7594FF',
      gradientEnd: '#5876E0',
    },
  },
  duration: {
    type: 'duration',
    property: 'duration',
    defaultTolerance: 5, // 5 minutes tolerance
    defaultGroupSize: 10, // 15 minute increments
    backgroundColor: '#7eadec',
    useRange: true,
    unitFormatter: () => 'min',
    suffixFormatter: () => 'minutes',
    titleFormatter: ({ key, groupSize }) => {
      if (groupSize) {
        const startMinutes = Math.round(Number(key));
        const endMinutes = Math.round(Number(key) + groupSize);

        return `${startMinutes}-${endMinutes}`;
      }

      return `${Math.round(Number(key) / 60)}`;
    },
    valueExtractor: (sample) => convertDurationToMinutesQuantity(sample.duration),
    enabled: true,
    label: 'Duration',
    icon: 'time',
    description: 'Workout duration',
    colorProfile: {
      primary: '#7eadec',
      secondary: '#658ABC',
      gradientStart: '#8BBEFF',
      gradientEnd: '#719CD5',
    },
  },
  temperature: {
    type: 'temperature',
    property: 'temperature',
    defaultTolerance: 2,
    defaultGroupSize: 5,
    backgroundColor: '#b0c3f1',
    useRange: true,
    unitFormatter: () => '°C',
    titleFormatter: ({ key, groupSize }) => {
      if (groupSize) {
        const start = Number(key);
        const end = start + groupSize;

        return `${start}-${end}`;
      }

      return `${key}`;
    },
    suffixFormatter: () => '°C',
    valueExtractor: ({ temperature }) => temperature,
    // UI properties (merged from UIConfig)
    enabled: true,
    label: 'Temperature',
    /*     tolerance: 2.5,
    groupSize: 5, */
    icon: 'thermometer',
    description: 'Temperature during workout',
    // Color properties
    colorProfile: {
      primary: '#b0c3f1',
      secondary: '#8D9CC1',
      gradientStart: '#C2D5FF',
      gradientEnd: '#9EB0D9',
    },
  },
  humidity: {
    type: 'humidity',
    property: 'humidity',
    defaultTolerance: 5,
    defaultGroupSize: 10,
    backgroundColor: '#ced0de',
    useRange: true,
    unitFormatter: () => '% humidity',
    titleFormatter: ({ key, groupSize }) => {
      if (groupSize) {
        const start = Number(key);
        const end = start + groupSize;

        return `${start}-${end}`;
      }

      return `${key}`;
    },
    suffixFormatter: () => '%',
    valueExtractor: ({ humidity }) => humidity,
    // UI properties (merged from UIConfig)
    enabled: true,
    label: 'Humidity',
    /*     tolerance: 5,
    groupSize: 10, */
    icon: 'cloud-outline',
    description: 'Humidity during workout',
    // Color properties
    colorProfile: {
      primary: '#ced0de',
      secondary: '#A5A6B1',
      gradientStart: '#E3E5F4',
      gradientEnd: '#B9BBC7',
    },
  },
};

/**
 * The labels for the tabs used to navigate in the Group Stats
 */
export const groupStatsTabs: TabOption[] = [
  { id: 'stats', label: 'Stats' },
  { id: 'compare', label: 'Compare' },
  { id: 'predictions', label: 'Progression' },
];
