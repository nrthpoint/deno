import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group, GroupType } from '@/types/Groups';

import { generateProgressionData } from './progression';

const createMockWorkout = (
  startDate: string,
  duration: number,
  distance: number,
): ExtendedWorkout =>
  ({
    startDate: new Date(startDate),
    endDate: new Date(startDate),
    duration: { quantity: duration * 60, unit: 's' }, // Convert minutes to seconds
    totalDistance: { quantity: distance, unit: 'km' },
    totalElevation: { quantity: 0, unit: 'm' },
    humidity: { quantity: 50, unit: '%' },
    averagePace: { quantity: 5, unit: 'min/km' },
    daysAgo: '1 day ago',
    prettyPace: '5:00',
    achievements: {
      isAllTimeFastest: false,
      isAllTimeLongest: false,
      isAllTimeFurthest: false,
      isAllTimeHighestElevation: false,
    },
    workoutActivityType: 1,
    isIndoor: false,
  }) as ExtendedWorkout;

const createMockGroup = (
  workouts: ExtendedWorkout[],
  groupType: GroupType = 'distance',
): Group => ({
  key: '5',
  unit: 'km',
  title: '5km',
  suffix: 'km',
  type: groupType,
  rank: 1,
  rankLabel: '1st',
  runs: workouts,
  skipped: 0,
  percentageOfTotalWorkouts: 50,
  totalVariation: { quantity: 0, unit: 'min' },
  totalDistance: { quantity: 50, unit: 'km' },
  totalDuration: { quantity: 300, unit: 'min' },
  totalElevation: { quantity: 100, unit: 'm' },
  averageHumidity: { quantity: 60, unit: '%' },
  averagePace: { quantity: 5, unit: 'min/km' },
  averageDuration: { quantity: 30, unit: 'min' },
  averageElevation: { quantity: 10, unit: 'm' },
  averageDistance: { quantity: 5, unit: 'km' },
  prettyPace: '5:00',
  prettyName: '5 kilometers',
  stats: [],
  predictions: {
    prediction4Week: null,
    prediction12Week: null,
    recommendations: [],
  },
  highlight: {} as ExtendedWorkout,
  worst: {} as ExtendedWorkout,
  greatestElevation: {} as ExtendedWorkout,
  lowestElevation: {} as ExtendedWorkout,
  mostRecent: {} as ExtendedWorkout,
  oldest: {} as ExtendedWorkout,
  variantDistribution: [],
  isIndoor: false,
});

describe('progression', () => {
  describe('generateProgressionData', () => {
    it('should generate distance progression data with personal bests', () => {
      const workouts = [
        createMockWorkout('2023-01-01', 30, 5), // 30 min
        createMockWorkout('2023-01-15', 28, 5), // 28 min - improvement
        createMockWorkout('2023-02-01', 29, 5), // 29 min - no improvement
        createMockWorkout('2023-02-15', 27, 5), // 27 min - improvement
      ];

      const group = createMockGroup(workouts, 'distance');
      const progressionData = generateProgressionData(group, 'distance');

      expect(progressionData.title).toBe('Personal Best Progression');
      expect(progressionData.metricLabel).toBe('Best Time');
      expect(progressionData.entries).toHaveLength(3); // 30min, 28min, 27min
      expect(progressionData.entries[0].value).toContain('30min');
      expect(progressionData.entries[1].value).toContain('28min');
      expect(progressionData.entries[2].value).toContain('27min');
    });

    it('should generate pace progression data with total distance', () => {
      const workouts = [
        createMockWorkout('2023-01-01', 30, 5),
        createMockWorkout('2023-01-15', 28, 3),
        createMockWorkout('2023-02-01', 32, 7),
      ];

      const group = createMockGroup(workouts, 'pace');
      const progressionData = generateProgressionData(group, 'pace');

      expect(progressionData.title).toBe('Distance Coverage Progression');
      expect(progressionData.metricLabel).toBe('Total Distance');
      expect(progressionData.entries.length).toBeGreaterThan(0);
    });

    it('should handle empty workouts gracefully', () => {
      const group = createMockGroup([], 'distance');
      const progressionData = generateProgressionData(group, 'distance');

      expect(progressionData.entries).toHaveLength(0);
    });

    it('should generate duration progression data', () => {
      const workouts = [
        createMockWorkout('2023-01-01', 30, 5),
        createMockWorkout('2023-01-15', 30, 6),
      ];

      const group = createMockGroup(workouts, 'duration');
      const progressionData = generateProgressionData(group, 'duration');

      expect(progressionData.title).toBe('Distance Achievement Progression');
      expect(progressionData.metricLabel).toBe('Total Distance');
    });
  });
});
