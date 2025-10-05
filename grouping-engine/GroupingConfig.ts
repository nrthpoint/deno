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
  },
  pace: {
    type: 'pace',
    property: 'pace',
    defaultTolerance: 0.25,
    defaultGroupSize: 0.5,
    backgroundColor: '#5c96eb',
    unitFormatter: () => 'min/mile',
    titleFormatter: (key) => `${key}`,
    suffixFormatter: () => 'min/mile',
    valueExtractor: ({ pace }) => pace,
  },
  elevation: {
    type: 'elevation',
    property: 'elevation',
    defaultTolerance: 50,
    defaultGroupSize: 100,
    backgroundColor: '#6283f7',
    useRange: true,
    unitFormatter: () => 'meters',
    titleFormatter: (key, _sample, _distanceUnit, groupSize) => {
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
  },
  duration: {
    type: 'duration',
    property: 'duration',
    defaultTolerance: 300, // 5 minutes tolerance
    defaultGroupSize: 900, // 15 minute increments
    backgroundColor: '#7eadec',
    useRange: true,
    unitFormatter: () => 'min',
    suffixFormatter: () => 'minutes',
    titleFormatter: (key, _sample, _distanceUnit, groupSize) => {
      if (groupSize) {
        const startMinutes = Math.round(Number(key) / 60);
        const endMinutes = Math.round((Number(key) + groupSize) / 60);

        return `${startMinutes}-${endMinutes}`;
      }

      return `${Math.round(Number(key) / 60)}`;
    },
    valueExtractor: (sample) => convertDurationToMinutesQuantity(sample.duration),
  },
  temperature: {
    type: 'temperature',
    property: 'temperature',
    defaultTolerance: 2,
    defaultGroupSize: 5,
    backgroundColor: '#b0c3f1',
    useRange: true,
    unitFormatter: () => '°C',
    titleFormatter: (key, _sample, _distanceUnit, groupSize) => {
      if (groupSize) {
        const start = Number(key);
        const end = start + groupSize;

        return `${start}-${end}`;
      }

      return `${key}`;
    },
    suffixFormatter: () => '°C',
    valueExtractor: ({ temperature }) => temperature,
  },
  humidity: {
    type: 'humidity',
    property: 'humidity',
    defaultTolerance: 5,
    defaultGroupSize: 10,
    backgroundColor: '#ced0de',
    useRange: true,
    unitFormatter: () => '% humidity',
    titleFormatter: (key, _sample, _distanceUnit, groupSize) => {
      if (groupSize) {
        const start = Number(key);
        const end = start + groupSize;

        return `${start}-${end}`;
      }

      return `${key}`;
    },
    suffixFormatter: () => '%',
    valueExtractor: ({ humidity }) => humidity,
  },
};
