import { groupRunsByDistance } from './groupByDistance';
import { ExtendedWorkout } from '@/types/workout';
import { Quantity } from '@kingstinct/react-native-healthkit';

const createMockWorkout = (
  distance: number,
  unit: string = 'mi',
  averagePace?: number,
): ExtendedWorkout =>
  ({
    totalDistance: { unit, quantity: distance } as Quantity,
    averagePace: averagePace
      ? ({ unit: 'min/mi', quantity: averagePace } as Quantity)
      : ({ unit: 'min/mi', quantity: 8 } as Quantity),
    daysAgo: '1 day ago',
    prettyPace: '8:00',
  }) as unknown as ExtendedWorkout;

describe('groupRunsByDistance', () => {
  describe('basic functionality', () => {
    it('should group runs by nearest whole mile distance', () => {
      const runs = [
        createMockWorkout(3.1), // Should be grouped as 3 miles
        createMockWorkout(3.2), // Should be grouped as 3 miles
        createMockWorkout(5.0), // Should be grouped as 5 miles
        createMockWorkout(4.9), // Should be grouped as 5 miles
      ];

      const result = groupRunsByDistance(runs);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result[3]).toBeDefined();
      expect(result[5]).toBeDefined();
      expect(result[3].runs).toHaveLength(2);
      expect(result[5].runs).toHaveLength(2);
    });

    it('should create correct group titles with units', () => {
      const runs = [createMockWorkout(3.1, 'mi')];

      const result = groupRunsByDistance(runs);

      expect(result[3].title).toBe('3 mi');
    });

    it('should handle different distance units', () => {
      const runs = [createMockWorkout(5.1, 'km')];

      const result = groupRunsByDistance(runs);

      expect(result[5].title).toBe('5 km');
    });
  });

  describe('tolerance behavior', () => {
    it('should use default tolerance of 0.25', () => {
      const runs = [
        createMockWorkout(3.25), // Within tolerance (0.25)
        createMockWorkout(3.26), // Outside tolerance (0.26 > 0.25)
      ];

      const result = groupRunsByDistance(runs);

      expect(result[3]).toBeDefined();
      expect(result[3].runs).toHaveLength(1); // Only the first run should be included
    });

    it('should respect custom tolerance', () => {
      const runs = [
        createMockWorkout(3.3), // Outside default tolerance but within 0.35
        createMockWorkout(3.4), // Outside both tolerances
      ];

      const result = groupRunsByDistance(runs, 0.35);

      expect(result[3]).toBeDefined();
      expect(result[3].runs).toHaveLength(1); // Only the first run should be included
    });

    it('should exclude runs outside tolerance', () => {
      const runs = [
        createMockWorkout(3.5), // Too far from 3 (0.5 > 0.25) and from 4 (0.5 > 0.25)
      ];

      const result = groupRunsByDistance(runs);

      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe('highlight selection', () => {
    it('should set the first run as initial highlight', () => {
      const runs = [createMockWorkout(3.1)];

      const result = groupRunsByDistance(runs);

      expect(result[3].highlight).toBe(runs[0]);
    });

    it('should set fastest run as highlight', () => {
      // Note: Lower pace values mean faster pace
      const runs = [
        createMockWorkout(3.1, 'mi', 8.0), // slower pace
        createMockWorkout(3.2, 'mi', 7.0), // faster pace
      ];

      const result = groupRunsByDistance(runs);

      // Should select the run with faster pace (7.0 min/mile)
      expect(result[3].highlight).toBe(runs[1]);
    });

    it('should handle runs without pace gracefully', () => {
      const runs = [
        createMockWorkout(3.1, 'mi', 8.0), // has pace
        {
          // run without pace
          totalDistance: { unit: 'mi', quantity: 3.2 },
          averagePace: undefined,
          daysAgo: '1 day ago',
          prettyPace: '',
        } as unknown as ExtendedWorkout,
      ];

      const result = groupRunsByDistance(runs);

      // Should select the run with pace since the other doesn't have pace
      expect(result[3].highlight).toBe(runs[0]);
    });

    it('should prefer runs with pace over runs without pace', () => {
      const runs = [
        {
          // run without pace
          totalDistance: { unit: 'mi', quantity: 3.1 },
          averagePace: undefined,
          daysAgo: '1 day ago',
          prettyPace: '',
        } as unknown as ExtendedWorkout,
        createMockWorkout(3.2, 'mi', 8.0), // has pace
      ];

      const result = groupRunsByDistance(runs);

      // Should select the run with pace
      expect(result[3].highlight).toBe(runs[1]);
    });

    it('should handle equal paces by keeping first run', () => {
      const runs = [
        createMockWorkout(3.1, 'mi', 8.0), // same pace
        createMockWorkout(3.2, 'mi', 8.0), // same pace
      ];

      const result = groupRunsByDistance(runs);

      // Should keep the first run when paces are equal
      expect(result[3].highlight).toBe(runs[0]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = groupRunsByDistance([]);

      expect(result).toEqual({});
    });

    it('should handle single run', () => {
      const runs = [createMockWorkout(5.0)];

      const result = groupRunsByDistance(runs);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result[5].runs).toHaveLength(1);
      expect(result[5].highlight).toBe(runs[0]);
    });

    it('should handle runs with zero distance', () => {
      const runs = [createMockWorkout(0.0)];

      const result = groupRunsByDistance(runs);

      expect(result[0]).toBeDefined();
      expect(result[0].runs).toHaveLength(1);
    });

    it('should handle negative distances (edge case)', () => {
      const runs = [createMockWorkout(-1.0)];

      const result = groupRunsByDistance(runs);

      expect(result[-1]).toBeDefined();
      expect(result[-1].runs).toHaveLength(1);
    });

    it('should handle very large distances', () => {
      const runs = [createMockWorkout(26.2)]; // Marathon distance

      const result = groupRunsByDistance(runs);

      expect(result[26]).toBeDefined();
      expect(result[26].runs).toHaveLength(1);
    });
  });

  describe('multiple runs per group', () => {
    it('should handle multiple runs in the same group', () => {
      const runs = [
        createMockWorkout(5.0),
        createMockWorkout(5.1),
        createMockWorkout(4.9),
        createMockWorkout(5.2),
      ];

      const result = groupRunsByDistance(runs);

      expect(result[5].runs).toHaveLength(4);
      expect(result[5].runs).toContain(runs[0]);
      expect(result[5].runs).toContain(runs[1]);
      expect(result[5].runs).toContain(runs[2]);
      expect(result[5].runs).toContain(runs[3]);
    });
  });

  describe('console warnings', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log warning for runs outside tolerance', () => {
      const runs = [createMockWorkout(3.5)]; // Outside default tolerance

      groupRunsByDistance(runs);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Run with distance 3.5 is not close enough to a whole number. Skipping.',
        ),
      );
    });

    it('should not log warning for runs within tolerance', () => {
      const runs = [createMockWorkout(3.2)]; // Within tolerance

      groupRunsByDistance(runs);

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});
