import { GroupConfig } from '@/grouping-engine/types/GroupConfig';
import { GroupType } from '@/types/Groups';
import { convertDurationToMinutesQuantity } from '@/utils/time';

/**
 * Registry of all available grouping configurations
 */
export const GROUPING_CONFIGS: Record<GroupType, GroupConfig> = {
  distance: {
    type: 'distance',
    property: 'totalDistance',
    defaultTolerance: 0.5,
    defaultGroupSize: 1.0,
    backgroundColor: '#5681FE',
    unitFormatter: (_key, sample) => sample.totalDistance?.unit || 'mi',
    titleFormatter: (key, sample) => `${key}${sample.totalDistance?.unit}`,
    suffixFormatter: (distanceUnit) => distanceUnit,
    valueExtractor: (sample) => sample.totalDistance,
  },
  pace: {
    type: 'pace',
    property: 'averagePace',
    defaultTolerance: 0.5,
    defaultGroupSize: 1.0,
    backgroundColor: '#5c96eb',
    unitFormatter: () => 'min/mile',
    titleFormatter: (key) => `${key} min/mile`,
    suffixFormatter: () => 'min/mile',
    valueExtractor: (sample) => sample.averagePace,
  },
  elevation: {
    type: 'elevation',
    property: 'totalElevation',
    defaultTolerance: 50,
    defaultGroupSize: 100,
    backgroundColor: '#6283f7',
    unitFormatter: () => 'm',
    titleFormatter: (key) => `${key}m elevation`,
    suffixFormatter: () => 'm',
    valueExtractor: (sample) => sample.totalElevation,
    filter: (sample) => sample.totalElevation && sample.totalElevation.quantity > 0,
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
};
