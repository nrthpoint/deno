import { TabOption } from '@/components/TabBar/TabBar';
import { GroupConfig } from '@/grouping-engine/types/GroupConfig';
import { GroupType } from '@/types/Groups';
import { convertDurationToMinutesQuantity } from '@/utils/time';

/**
 * Registry of all available grouping configurations
 */
export const GROUPING_CONFIGS: Record<GroupType, GroupConfig> = {
  distance: {
    enabled: true,

    backgroundColor: '#5681FE',
    colorProfile: {
      gradientEnd: '#4F75E5',
      gradientStart: '#6291FF',
      primary: '#5681FE',
      secondary: '#4566CB',
    },
    defaultGroupSize: 1.0,
    description: 'Distance covered',
    foregroundColor: '#fff', //'#5681FE',
    icon: 'walk',
    label: 'Distance',
    property: 'distance',
    type: 'distance',

    suffixFormatter: (distanceUnit) => distanceUnit,
    unitFormatter: (_key, { distance }) => distance?.unit,
    valueExtractor: ({ distance }) => distance,
  },

  pace: {
    enabled: true,

    backgroundColor: '#5c96eb',
    colorProfile: {
      gradientEnd: '#5287D4',
      gradientStart: '#6FA5FF',
      primary: '#5c96eb',
      secondary: '#4A78BC',
    },
    defaultGroupSize: 0.5,
    description: 'Average pace',
    foregroundColor: '#fff', //'#5c96eb',
    icon: 'speedometer',
    label: 'Pace',
    property: 'pace',
    type: 'pace',

    suffixFormatter: () => 'min/mile',
    titleFormatter: ({ key }) => `${key}`,
    unitFormatter: () => 'min/mile',
    valueExtractor: ({ pace }) => pace,
  },

  elevation: {
    enabled: true,
    useRange: true,

    backgroundColor: '#6283f7',
    colorProfile: {
      gradientEnd: '#5876E0',
      gradientStart: '#7594FF',
      primary: '#6283f7',
      secondary: '#4E69C5',
    },
    defaultGroupSize: 100,
    description: 'Elevation climbed',
    foregroundColor: '#fff', //'#6283f7',
    icon: 'bar-chart',
    label: 'Elevation',
    property: 'elevation',
    type: 'elevation',

    filter: (sample) => sample.elevation && sample.elevation.quantity > 0,
    suffixFormatter: () => 'm',
    titleFormatter: ({ key, groupSize }) => {
      if (groupSize) {
        const start = Number(key);
        const end = start + groupSize;
        return `${start}-${end}`;
      }
      return `${key}`;
    },
    unitFormatter: () => 'meters',
    valueExtractor: ({ elevation }) => elevation,
  },

  duration: {
    enabled: true,
    useRange: true,

    backgroundColor: '#7eadec',
    colorProfile: {
      gradientEnd: '#719CD5',
      gradientStart: '#8BBEFF',
      primary: '#7eadec',
      secondary: '#658ABC',
    },
    defaultGroupSize: 10,
    description: 'Workout duration',
    foregroundColor: '#fff', //'#7eadec',
    icon: 'time',
    label: 'Duration',
    property: 'duration',
    type: 'duration',

    suffixFormatter: () => 'minutes',
    titleFormatter: ({ key, groupSize }) => {
      if (groupSize) {
        const startMinutes = Math.round(Number(key));
        const endMinutes = Math.round(Number(key) + groupSize);
        return `${startMinutes}-${endMinutes}`;
      }
      return `${Math.round(Number(key) / 60)}`;
    },
    unitFormatter: () => 'min',
    valueExtractor: (sample) => convertDurationToMinutesQuantity(sample.duration),
  },

  temperature: {
    enabled: true,
    useRange: true,

    backgroundColor: '#b0c3f1',
    colorProfile: {
      gradientEnd: '#9EB0D9',
      gradientStart: '#C2D5FF',
      primary: '#b0c3f1',
      secondary: '#8D9CC1',
    },
    defaultGroupSize: 5,
    description: 'Temperature during workout',
    foregroundColor: '#fff', //'#616c87ff',
    icon: 'thermometer',
    label: 'Temperature',
    property: 'temperature',
    type: 'temperature',

    suffixFormatter: () => '°C',
    titleFormatter: ({ key, groupSize }) => {
      if (groupSize) {
        const start = Number(key);
        const end = start + groupSize;
        return `${start}-${end}`;
      }
      return `${key}`;
    },
    unitFormatter: () => '°C',
    valueExtractor: ({ temperature }) => temperature,
  },

  humidity: {
    enabled: true,
    useRange: true,

    backgroundColor: '#ced0de',
    colorProfile: {
      gradientEnd: '#B9BBC7',
      gradientStart: '#E3E5F4',
      primary: '#ced0de',
      secondary: '#A5A6B1',
    },
    defaultGroupSize: 10,
    description: 'Humidity during workout',
    foregroundColor: '#fff', //'#575c82ff',
    icon: 'cloud-outline',
    label: 'Humidity',
    property: 'humidity',
    type: 'humidity',

    suffixFormatter: () => '%',
    titleFormatter: ({ key, groupSize }) => {
      if (groupSize) {
        const start = Number(key);
        const end = start + groupSize;
        return `${start}-${end}`;
      }
      return `${key}`;
    },
    unitFormatter: () => '% humidity',
    valueExtractor: ({ humidity }) => humidity,
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
