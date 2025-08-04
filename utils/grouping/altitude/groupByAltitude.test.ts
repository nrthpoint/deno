import { groupRunsByAltitude } from './groupByAltitude';
import { ExtendedWorkout } from '@/types/workout';
import { newQuantity } from '@/utils/quantity';
import { Quantity } from '@kingstinct/react-native-healthkit';

// Helper function to create a mock workout with elevation
const createMockWorkoutWithElevation = ({
  elevationAscended = 100,
  distance = 5.0,
  duration = 30 * 60, // 30 minutes in seconds
  startDate = new Date('2024-01-01'),
  unit = 'mi',
}: {
  elevationAscended?: number;
  distance?: number;
  duration?: number;
  startDate?: Date;
  unit?: string;
} = {}): ExtendedWorkout =>
  ({
    startDate,
    endDate: new Date(startDate.getTime() + duration * 1000),
    duration: newQuantity(duration, 's'),
    totalDistance: { unit, quantity: distance } as Quantity,
    totalElevationAscended: newQuantity(elevationAscended, 'm'),
    averagePace: { unit: 'min/mile', quantity: duration / 60 / distance } as Quantity,
    daysAgo: '1 day ago',
    prettyPace: '6:00 min/mile',
  }) as unknown as ExtendedWorkout;

describe('groupRunsByAltitude', () => {
  describe('basic grouping functionality', () => {
    it('should group runs by elevation ascended within tolerance', () => {
      const mockWorkouts: ExtendedWorkout[] = [
        createMockWorkoutWithElevation({ elevationAscended: 95 }), // Should group to 100m
        createMockWorkoutWithElevation({ elevationAscended: 105 }), // Should group to 100m
        createMockWorkoutWithElevation({ elevationAscended: 195 }), // Should group to 200m
        createMockWorkoutWithElevation({ elevationAscended: 205 }), // Should group to 200m
      ];

      const result = groupRunsByAltitude({
        samples: mockWorkouts,
        tolerance: 50, // 50m tolerance
        groupSize: 100, // 100m increments
      });

      expect(Object.keys(result)).toHaveLength(2);
      expect(result['100']).toBeDefined();
      expect(result['200']).toBeDefined();
      expect(result['100'].runs).toHaveLength(2);
      expect(result['200'].runs).toHaveLength(2);
    });

    it('should skip runs outside tolerance', () => {
      const mockWorkouts: ExtendedWorkout[] = [
        createMockWorkoutWithElevation({ elevationAscended: 95 }), // Should group to 100m
        createMockWorkoutWithElevation({ elevationAscended: 40 }), // Should be skipped (too far from 100m)
        createMockWorkoutWithElevation({ elevationAscended: 160 }), // Should be skipped (too far from 100m or 200m)
      ];

      const result = groupRunsByAltitude({
        samples: mockWorkouts,
        tolerance: 50, // 50m tolerance
        groupSize: 100, // 100m increments
      });

      expect(Object.keys(result)).toHaveLength(1);
      expect(result['100']).toBeDefined();
      expect(result['100'].runs).toHaveLength(1);
    });

    it('should return empty object when no runs have elevation data', () => {
      const mockWorkouts: ExtendedWorkout[] = [
        {
          ...createMockWorkoutWithElevation({ elevationAscended: 0 }),
          totalElevationAscended: undefined,
        },
        {
          ...createMockWorkoutWithElevation({ elevationAscended: 0 }),
          totalElevationAscended: newQuantity(0, 'm'),
        },
      ];

      const result = groupRunsByAltitude({
        samples: mockWorkouts,
        tolerance: 50,
        groupSize: 100,
      });

      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe('group statistics', () => {
    it('should calculate correct group statistics', () => {
      const workout1 = createMockWorkoutWithElevation({
        elevationAscended: 95,
        distance: 5.0,
        duration: 30 * 60,
      });
      const workout2 = createMockWorkoutWithElevation({
        elevationAscended: 105,
        distance: 6.0,
        duration: 36 * 60,
      });

      const mockWorkouts: ExtendedWorkout[] = [workout1, workout2];

      const result = groupRunsByAltitude({
        samples: mockWorkouts,
        tolerance: 50,
        groupSize: 100,
      });

      const group = result['100'];
      expect(group).toBeDefined();
      expect(group.runs).toHaveLength(2);
      expect(group.totalDistance.quantity).toBe(11.0); // 5 + 6
      expect(group.totalDuration.quantity).toBe(66 * 60); // 30 + 36 minutes
      expect(group.totalElevationAscended.quantity).toBe(200); // 95 + 105
      expect(group.percentageOfTotalWorkouts).toBe(100); // 2/2 * 100
    });

    it('should identify highlight and worst runs correctly', () => {
      const workout1 = createMockWorkoutWithElevation({ elevationAscended: 95 }); // Lower elevation
      const workout2 = createMockWorkoutWithElevation({ elevationAscended: 105 }); // Higher elevation

      const mockWorkouts: ExtendedWorkout[] = [workout1, workout2];

      const result = groupRunsByAltitude({
        samples: mockWorkouts,
        tolerance: 50,
        groupSize: 100,
      });

      const group = result['100'];
      expect(group.highlight.totalElevationAscended?.quantity).toBe(105); // Higher elevation run
      expect(group.worst.totalElevationAscended?.quantity).toBe(95); // Lower elevation run
    });

    it('should update most recent run correctly', () => {
      const olderDate = new Date('2024-01-01');
      const newerDate = new Date('2024-01-02');

      const workout1 = createMockWorkoutWithElevation({
        elevationAscended: 95,
        startDate: olderDate,
      });
      const workout2 = createMockWorkoutWithElevation({
        elevationAscended: 105,
        startDate: newerDate,
      });

      const mockWorkouts: ExtendedWorkout[] = [workout1, workout2];

      const result = groupRunsByAltitude({
        samples: mockWorkouts,
        tolerance: 50,
        groupSize: 100,
      });

      const group = result['100'];
      expect(group.mostRecent.startDate).toEqual(newerDate); // Newer run
    });
  });

  describe('group stats array', () => {
    it('should generate correct stats for altitude groups', () => {
      const mockWorkouts: ExtendedWorkout[] = [
        createMockWorkoutWithElevation({ elevationAscended: 95, distance: 5.0 }),
        createMockWorkoutWithElevation({ elevationAscended: 105, distance: 6.0 }),
      ];

      const result = groupRunsByAltitude({
        samples: mockWorkouts,
        tolerance: 50,
        groupSize: 100,
      });

      const group = result['100'];
      expect(group.stats).toHaveLength(6);

      const statTypes = group.stats.map((stat) => stat.type);
      expect(statTypes).toContain('altitude');
      expect(statTypes).toContain('pace');
      expect(statTypes).toContain('distance');

      const statLabels = group.stats.map((stat) => stat.label);
      expect(statLabels).toContain('Highest Elevation Gain');
      expect(statLabels).toContain('Lowest Elevation Gain');
      expect(statLabels).toContain('Best Pace');
      expect(statLabels).toContain('Average Pace');
      expect(statLabels).toContain('Total Distance');
      expect(statLabels).toContain('Avg Elevation/Distance');
    });
  });

  describe('ranking and sorting', () => {
    it('should assign ranks and sort groups correctly', () => {
      const mockWorkouts: ExtendedWorkout[] = [
        createMockWorkoutWithElevation({ elevationAscended: 95 }), // 100m group
        createMockWorkoutWithElevation({ elevationAscended: 105 }), // 100m group
        createMockWorkoutWithElevation({ elevationAscended: 195 }), // 200m group
        createMockWorkoutWithElevation({ elevationAscended: 295 }), // 300m group
        createMockWorkoutWithElevation({ elevationAscended: 305 }), // 300m group
        createMockWorkoutWithElevation({ elevationAscended: 310 }), // 300m group
      ];

      const result = groupRunsByAltitude({
        samples: mockWorkouts,
        tolerance: 50,
        groupSize: 100,
      });

      const groupKeys = Object.keys(result);
      expect(groupKeys).toEqual(['100', '200', '300']); // Should be sorted

      // 300m group should have rank 1 (most runs: 3)
      // 100m group should have rank 2 (2 runs)
      // 200m group should have rank 3 (1 run)
      expect(result['300'].rank).toBe(1);
      expect(result['100'].rank).toBe(2);
      expect(result['200'].rank).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('should handle single run', () => {
      const mockWorkouts: ExtendedWorkout[] = [
        createMockWorkoutWithElevation({ elevationAscended: 100 }),
      ];

      const result = groupRunsByAltitude({
        samples: mockWorkouts,
        tolerance: 50,
        groupSize: 100,
      });

      expect(Object.keys(result)).toHaveLength(1);
      expect(result['100'].runs).toHaveLength(1);
      expect(result['100'].highlight.totalElevationAscended?.quantity).toBe(100);
      expect(result['100'].worst.totalElevationAscended?.quantity).toBe(100);
      expect(result['100'].mostRecent.totalElevationAscended?.quantity).toBe(100);
    });

    it('should handle zero elevation correctly', () => {
      const mockWorkouts: ExtendedWorkout[] = [
        createMockWorkoutWithElevation({ elevationAscended: 0 }),
        createMockWorkoutWithElevation({ elevationAscended: 25 }), // Should group to 0
      ];

      const result = groupRunsByAltitude({
        samples: mockWorkouts,
        tolerance: 50,
        groupSize: 100,
      });

      expect(Object.keys(result)).toHaveLength(1);
      expect(result['0']).toBeDefined();
      expect(result['0'].runs).toHaveLength(2);
    });

    it('should use default parameters when not provided', () => {
      const mockWorkouts: ExtendedWorkout[] = [
        createMockWorkoutWithElevation({ elevationAscended: 100 }),
      ];

      const result = groupRunsByAltitude({ samples: mockWorkouts });

      expect(Object.keys(result)).toHaveLength(1);
      expect(result['100']).toBeDefined();
    });
  });
});
