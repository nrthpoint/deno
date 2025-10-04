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
    unitFormatter: (_key, sample) => sample.distance?.unit || 'mi',
    titleFormatter: (key, sample) => `${key}${sample.distance?.unit}`,
    suffixFormatter: (distanceUnit) => distanceUnit,
    valueExtractor: (sample) => sample.distance,
  },
  pace: {
    type: 'pace',
    property: 'pace',
    defaultTolerance: 0.25,
    defaultGroupSize: 0.5,
    backgroundColor: '#5c96eb',
    unitFormatter: () => 'min/mile',
    titleFormatter: (key) => `${key} min/mile`,
    suffixFormatter: () => 'min/mile',
    valueExtractor: (sample) => sample.pace,
  },
  elevation: {
    type: 'elevation',
    property: 'elevation',
    defaultTolerance: 50,
    defaultGroupSize: 100,
    backgroundColor: '#6283f7',
    unitFormatter: () => 'm',
    titleFormatter: (key) => `${key}m elevation`,
    suffixFormatter: () => 'm',
    valueExtractor: (sample) => sample.elevation,
    filter: (sample) => sample.elevation && sample.elevation.quantity > 0,
  },
  duration: {
    type: 'duration',
    property: 'duration',
    defaultTolerance: 300, // 5 minutes tolerance
    defaultGroupSize: 900, // 15 minute increments
    backgroundColor: '#7eadec',
    unitFormatter: () => 'minutes',
    suffixFormatter: () => 'minutes',
    titleFormatter: (key) => `${Math.round(Number(key) / 60)} min`,
    valueExtractor: (sample) => convertDurationToMinutesQuantity(sample.duration),
  },
  temperature: {
    type: 'temperature',
    property: 'temperature',
    defaultTolerance: 2,
    defaultGroupSize: 5,
    backgroundColor: '#b0c3f1',
    unitFormatter: () => '°C',
    titleFormatter: (key) => `${key}°C`,
    suffixFormatter: () => '°C',
    valueExtractor: (sample) => sample.temperature,
  },
  humidity: {
    type: 'humidity',
    property: 'humidity',
    defaultTolerance: 5,
    defaultGroupSize: 10,
    backgroundColor: '#ced0de',
    unitFormatter: () => '%',
    titleFormatter: (key) => `${key}% humidity`,
    suffixFormatter: () => '%',
    valueExtractor: (sample) => sample.humidity,
  },
};
