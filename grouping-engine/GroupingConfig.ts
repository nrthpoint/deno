import { GroupConfig } from '@/grouping-engine/types/GroupConfig';
import { GroupType } from '@/types/Groups';

/**
 * Registry of all available grouping configurations
 */
export const GROUPING_CONFIGS: Record<GroupType, GroupConfig> = {
  distance: {
    type: 'distance',
    property: 'totalDistance',
    defaultTolerance: 0.25,
    defaultGroupSize: 1.0,
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
    unitFormatter: () => 's',
    titleFormatter: (key) => `${Math.round(Number(key) / 60)} min`,
    suffixFormatter: () => 'minutes',
    valueExtractor: (sample) => sample.duration,
  },
};
