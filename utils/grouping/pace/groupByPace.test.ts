import { groupRunsByPace } from '@/utils/grouping/pace/groupByPace';
import {
  createMockWorkout,
  createMockWorkoutWithoutDistance,
  createMockWorkoutWithoutPace,
} from '@/utils/grouping/test-utils';

describe('groupRunsByPace', () => {
  describe('basic functionality', () => {
    it('should group runs by nearest whole minute pace', () => {
      const samples = [
        createMockWorkout({
          distance: 3,
          averagePace: 7.3,
        }), // Should be grouped as 7 min/mile
        createMockWorkout({
          distance: 5,
          averagePace: 7.4,
        }), // Should be grouped as 7 min/mile
        createMockWorkout({
          distance: 8.1,
          averagePace: 8.1,
        }), // Should be grouped as 8 min/mile
        createMockWorkout({
          distance: 8.2,
          averagePace: 8.2,
        }), // Should be grouped as 8 min/mile
      ];

      const result = groupRunsByPace({ samples });

      expect(Object.keys(result)).toHaveLength(2);
      expect(result[7]).toBeDefined();
      expect(result[8]).toBeDefined();
      expect(result[7].runs).toHaveLength(2);
      expect(result[8].runs).toHaveLength(2);
    });

    it('should create correct group titles', () => {
      const samples = [
        createMockWorkout({
          distance: 3,
          averagePace: 7.3,
        }),
      ];

      const result = groupRunsByPace({ samples });

      expect(result[7].title).toBe('7 min/mile');
    });

    it('should set the longest distance run as highlight', () => {
      const samples = [
        createMockWorkout({
          distance: 3,
          averagePace: 7.3,
        }), // 3 miles
        createMockWorkout({
          distance: 5,
          averagePace: 7.4,
        }), // 5 miles - should be highlight
        createMockWorkout({
          distance: 4,
          averagePace: 7.2,
        }), // 4 miles
      ];

      const result = groupRunsByPace({ samples });

      expect(result[7].highlight).toBe(samples[1]); // The 5-mile run
    });
  });

  describe('tolerance behavior', () => {
    it('should use default tolerance of 0.5', () => {
      const samples = [
        createMockWorkout({
          distance: 3,
          averagePace: 7.25, // Within tolerance (0.5)
        }), // 7.5 rounds to 8, diff = 0.5, exactly at tolerance
        createMockWorkout({
          distance: 3,
          averagePace: 7.49,
        }), // 7.49 rounds to 7, diff = 0.49, within tolerance
      ];

      const result = groupRunsByPace({ samples });

      expect(result[8]).toBeDefined();
      expect(result[7]).toBeDefined();
      expect(result[8].runs).toHaveLength(1); // First run (7.5 -> 8)
      expect(result[7].runs).toHaveLength(1); // Second run (7.49 -> 7)
    });

    it('should respect custom tolerance', () => {
      const samples = [
        createMockWorkout({
          distance: 3,
          averagePace: 7.6, // 7.6 rounds to 8, diff = 0.4, within tolerance of 0.5
        }), // 7.6 rounds to 8, diff = 0.4, outside tolerance 0.3
        createMockWorkout({
          distance: 3,
          averagePace: 7.8,
        }), // 7.8 rounds to 8, diff = 0.2, within tolerance 0.3
      ];

      const result = groupRunsByPace({
        samples,
        tolerance: 0.3,
      }); // Custom tolerance of 0.3

      expect(result[8]).toBeDefined();
      expect(result[8].runs).toHaveLength(1); // Only the second run should be included
    });

    it('should exclude runs outside tolerance', () => {
      const samples = [
        createMockWorkout({
          distance: 3,
          averagePace: 7.6, // 7.6 rounds to 8, diff = 0.4, outside tolerance of 0.3
        }), // 7.6 rounds to 8, diff = 0.4, within default tolerance of 0.5
      ];

      const result = groupRunsByPace({
        samples,
        tolerance: 0.3, // Custom tolerance smaller than 0.4
      }); // Custom tolerance smaller than 0.4

      expect(Object.keys(result)).toHaveLength(0); // Should be excluded since 0.4 > 0.3
    });
  });

  describe('highlight selection - longest distance', () => {
    it('should set the first run as initial highlight', () => {
      const samples = [
        createMockWorkout({
          distance: 3,
          averagePace: 7.3,
        }),
      ];

      const result = groupRunsByPace({ samples });

      expect(result[7].highlight).toBe(samples[0]);
    });

    it('should update highlight to longest distance run', () => {
      const samples = [
        createMockWorkout({
          distance: 3,
          averagePace: 7.3,
        }),
        createMockWorkout({
          distance: 6,
          averagePace: 7.4,
        }),
        createMockWorkout({
          distance: 4,
          averagePace: 7.2,
        }),
      ];

      const result = groupRunsByPace({ samples });

      expect(result[7].highlight).toBe(samples[1]); // The 6-mile run
    });

    it('should handle runs with same distance', () => {
      const samples = [
        createMockWorkout({
          distance: 5,
          averagePace: 7.3,
        }), // 5 miles - first one should stay as highlight
        createMockWorkout({
          distance: 5,
          averagePace: 7.4,
        }), // 5 miles - same distance
      ];

      const result = groupRunsByPace({ samples });

      expect(result[7].highlight).toBe(samples[0]); // First one remains highlight
    });
  });

  describe('data validation', () => {
    it('should skip runs without averagePace', () => {
      const samples = [
        createMockWorkout({
          distance: 3,
          averagePace: 7.3,
        }),
        createMockWorkoutWithoutPace(),
        createMockWorkout({
          distance: 3,
          averagePace: 8.2,
        }),
      ];

      const result = groupRunsByPace({ samples });

      expect(Object.keys(result)).toHaveLength(2);
      expect(result[7].runs).toHaveLength(1);
      expect(result[8].runs).toHaveLength(1);
    });

    it('should skip runs without totalDistance', () => {
      const samples = [
        createMockWorkout({
          averagePace: 7.3,
        }),
        createMockWorkoutWithoutDistance(7.4),
        createMockWorkout({
          averagePace: 8.2,
        }),
      ];

      const result = groupRunsByPace({ samples });

      expect(Object.keys(result)).toHaveLength(2);
      expect(result[7].runs).toHaveLength(1);
      expect(result[8].runs).toHaveLength(1);
    });

    it('should handle runs with null/undefined pace and distance gracefully', () => {
      const samples = [
        createMockWorkout({
          averagePace: 7.3,
        }),
        createMockWorkoutWithoutPace(),
        createMockWorkoutWithoutDistance(8.2),
      ];

      const result = groupRunsByPace({ samples });

      expect(Object.keys(result)).toHaveLength(1);
      expect(result[7]).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = groupRunsByPace({
        samples: [],
      });

      expect(result).toEqual({});
    });

    it('should handle single run', () => {
      const samples = [
        createMockWorkout({
          distance: 5,
          averagePace: 8.0,
        }),
      ];

      const result = groupRunsByPace({ samples });

      expect(Object.keys(result)).toHaveLength(1);
      expect(result[8].runs).toHaveLength(1);
      expect(result[8].highlight).toBe(samples[0]);
    });

    it('should handle very fast paces', () => {
      const samples = [
        createMockWorkout({
          distance: 5,
          averagePace: 4.5, // Sub-5-minute mile
        }),
      ]; // Sub-5-minute mile

      const result = groupRunsByPace({ samples });

      expect(result[5]).toBeDefined();
      expect(result[5].runs).toHaveLength(1);
    });

    it('should handle very slow paces', () => {
      const samples = [
        createMockWorkout({
          distance: 5,
          averagePace: 12.3, // 12+ minute mile
        }),
      ];

      const result = groupRunsByPace({ samples });

      expect(result[12]).toBeDefined();
      expect(result[12].runs).toHaveLength(1);
    });

    it('should handle zero pace gracefully', () => {
      const samples = [
        createMockWorkout({
          distance: 5,
          averagePace: 0.0,
        }),
      ];

      const result = groupRunsByPace({ samples });

      expect(result[0]).toBeDefined();
      expect(result[0].runs).toHaveLength(1);
    });
  });

  describe('multiple runs per group', () => {
    it('should handle multiple runs in the same pace group', () => {
      const samples = [
        createMockWorkout({
          averagePace: 8.0,
          distance: 3,
        }),
        createMockWorkout({
          averagePace: 8.1,
          distance: 5,
        }),
        createMockWorkout({
          averagePace: 7.9,
          distance: 4,
        }),
        createMockWorkout({
          averagePace: 8.2,
          distance: 6,
        }),
      ];

      const result = groupRunsByPace({ samples });

      expect(result[8].runs).toHaveLength(4);
      expect(result[8].runs).toContain(samples[0]);
      expect(result[8].runs).toContain(samples[1]);
      expect(result[8].runs).toContain(samples[2]);
      expect(result[8].runs).toContain(samples[3]);
      expect(result[8].highlight).toBe(samples[3]); // 6-mile run is longest
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
      const samples = [
        createMockWorkout({
          averagePace: 7.6, // Outside tolerance of 0.3
        }),
      ]; // Outside tolerance of 0.3

      groupRunsByPace({
        samples,
        tolerance: 0.3,
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Run with pace 7.6 min/mile is not close enough to a whole minute. Skipping.',
        ),
      );
    });

    it('should not log warning for runs within tolerance', () => {
      const samples = [
        createMockWorkout({
          averagePace: 7.2, // Within default tolerance of 0.5
        }),
      ]; // Within default tolerance of 0.5

      groupRunsByPace({ samples });

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('comparison with distance grouping', () => {
    it('should group different distances with same pace together', () => {
      const samples = [
        createMockWorkout({
          averagePace: 7.2,
          distance: 3,
        }),
        createMockWorkout({
          averagePace: 7.4,
          distance: 5,
        }),
        createMockWorkout({
          averagePace: 7.2,
          distance: 10,
        }),
      ];

      const result = groupRunsByPace({ samples });

      expect(Object.keys(result)).toHaveLength(1);
      expect(result[7].runs).toHaveLength(3);
      expect(result[7].highlight).toBe(samples[2]); // 10-mile run is longest
    });
  });
});
