import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group, GroupType } from '@/types/Groups';

import {
  generateGroupSummary,
  shouldShowLowDataWarning,
  generateLowDataWarningMessage,
} from './groupSummary';

const createMockGroup = (
  runCount: number,
  groupType: GroupType = 'distance',
  customDates?: { mostRecent?: Date; oldest?: Date },
): Group => {
  const mockDate = customDates?.mostRecent || new Date('2023-01-01');
  const olderDate = customDates?.oldest || new Date('2022-12-01');

  return {
    key: '5',
    unit: 'km',
    title: '5km',
    suffix: 'km',
    type: groupType,
    rank: 1,
    rankLabel: '1st',
    runs: Array.from({ length: runCount }, () => ({}) as ExtendedWorkout),
    skipped: 0,
    percentageOfTotalWorkouts: 50,
    totalVariation: { quantity: 0, unit: 'min' },
    totalDistance: { quantity: 50, unit: 'km' },
    totalDuration: { quantity: 300, unit: 'min' },
    totalElevation: { quantity: 100, unit: 'm' },
    averageHumidity: { quantity: 60, unit: '%' },
    averageTemperature: { quantity: 20, unit: '°C' },
    averagePace: { quantity: 5, unit: 'min/km' },
    averageDuration: { quantity: 30, unit: 'min' },
    averageElevation: { quantity: 10, unit: 'm' },
    averageDistance: { quantity: 5, unit: 'km' },
    prettyPace: '5:00',
    prettyName: '5km',
    stats: [],
    predictions: {
      prediction4Week: null,
      prediction12Week: null,
    },
    highlight: {} as ExtendedWorkout,
    worst: {} as ExtendedWorkout,
    greatestElevation: {} as ExtendedWorkout,
    lowestElevation: {} as ExtendedWorkout,
    mostRecent: { endDate: mockDate } as ExtendedWorkout,
    consistencyScore: 75,
    consistencyMean: 100,
    consistencyMedian: 98,
    consistencyStandardDeviation: 10,
    consistencyCoefficientOfVariation: 0.1,
    oldest: { endDate: olderDate } as ExtendedWorkout,
    variantDistribution: [],
    isIndoor: false,
  };
};

describe('groupSummary', () => {
  describe('generateGroupSummary', () => {
    it('should generate correct summary for distance groups', () => {
      const group = createMockGroup(5, 'distance');
      const summary = generateGroupSummary(group, 'distance', 30);

      expect(summary).toContain('Over this month');
      expect(summary).toContain('your fastest times');
      expect(summary).toContain('**5**');
      expect(summary).toContain('runs for 5 kilometers');
      expect(summary).toContain('Your most recent workout was');
      expect(summary).toContain('and your oldest was');
    });

    it('should generate correct summary for pace groups', () => {
      const group = createMockGroup(3, 'pace');
      const summary = generateGroupSummary(group, 'pace', 7);

      expect(summary).toContain('Over this week');
      expect(summary).toContain('your performance');
      expect(summary).toContain('**3**');
      expect(summary).toContain('runs at 5 kilometers pace');
      expect(summary).toContain('Your most recent workout was');
    });

    it('should handle different time ranges', () => {
      const group = createMockGroup(10, 'distance');
      const summary = generateGroupSummary(group, 'distance', 365);

      expect(summary).toContain('Over the last 12 months');
      expect(summary).toContain('**10**');
    });

    it('should handle single workout smartly', () => {
      const group = createMockGroup(1, 'distance');
      const summary = generateGroupSummary(group, 'distance', 30);

      expect(summary).toContain('**1**');
      expect(summary).toContain('Your only workout was');
      expect(summary).not.toContain('and your oldest was');
    });

    it('should handle same-day workouts smartly', () => {
      const sameDate = new Date('2023-01-01');
      const group = createMockGroup(3, 'distance', {
        mostRecent: sameDate,
        oldest: sameDate,
      });

      const summary = generateGroupSummary(group, 'distance', 30);

      expect(summary).toContain('**3**');
      expect(summary).toContain('All your workouts were');
      expect(summary).not.toContain('and your oldest was');
    });
  });

  describe('shouldShowLowDataWarning', () => {
    it('should return true for groups with less than 3 runs', () => {
      expect(shouldShowLowDataWarning(createMockGroup(0))).toBe(true);
      expect(shouldShowLowDataWarning(createMockGroup(1))).toBe(true);
      expect(shouldShowLowDataWarning(createMockGroup(2))).toBe(true);
    });

    it('should return false for groups with 3 or more runs', () => {
      expect(shouldShowLowDataWarning(createMockGroup(3))).toBe(false);
      expect(shouldShowLowDataWarning(createMockGroup(5))).toBe(false);
    });
  });

  describe('generateLowDataWarningMessage', () => {
    it('should generate appropriate message for groups with no runs', () => {
      const group = createMockGroup(0);
      const message = generateLowDataWarningMessage(group, 'distance');

      expect(message).toContain('No runs for 5 kilometers found');
      expect(message).toContain('Complete more workouts');
    });

    it('should generate appropriate message for groups with 1 run', () => {
      const group = createMockGroup(1);
      const message = generateLowDataWarningMessage(group, 'pace');

      expect(message).toContain('Only **1** run at 5 kilometers pace found');
      expect(message).toContain('Complete more similar workouts');
    });

    it('should generate appropriate message for groups with 2 runs', () => {
      const group = createMockGroup(2);
      const message = generateLowDataWarningMessage(group, 'distance');

      expect(message).toContain('Only **2** runs for 5 kilometers found');
      expect(message).toContain('Complete more similar workouts');
    });
  });
});
