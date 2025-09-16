import { TimeRange } from '@/config/timeRanges';
import { BaseGroupStatCalculator } from '@/grouping-engine/calculators/Base';
import { DistanceGroupStatCalculator } from '@/grouping-engine/calculators/Distance';
import { DurationGroupStatCalculator } from '@/grouping-engine/calculators/Duration';
import { ElevationGroupStatCalculator } from '@/grouping-engine/calculators/Elevation';
import { PaceGroupStatCalculator } from '@/grouping-engine/calculators/Pace';
import { GroupConfig } from '@/grouping-engine/types/GroupConfig';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';

export interface GroupStatCalculator {
  calculateStats(
    _group: Group,
    _samples: readonly ExtendedWorkout[],
    _timeRangeInDays: TimeRange,
  ): void;
}

export function createStatCalculator(config: GroupConfig): GroupStatCalculator {
  switch (config.type) {
    case 'distance':
      return new DistanceGroupStatCalculator();
    case 'pace':
      return new PaceGroupStatCalculator();
    case 'elevation':
      return new ElevationGroupStatCalculator();
    case 'duration':
      return new DurationGroupStatCalculator();
    default:
      return new BaseGroupStatCalculator();
  }
}
