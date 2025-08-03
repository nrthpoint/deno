import { groupRunsByDistance } from '@/utils/grouping/distance/groupByDistance';
import { createMockWorkout, createMockWorkoutWithoutPace } from '@/utils/grouping/test-utils';

describe('groupRunsByDistance', () => {
  describe('basic functionality', () => {
    it('should group runs by nearest whole mile distance', () => {
      const samples = [
        createMockWorkout({
          distance: 3.1, // Should be grouped as 3 miles
        }), // Should be grouped as 3 miles
        createMockWorkout({
          distance: 3.2,
        }), // Should be grouped as 3 miles
        createMockWorkout({
          distance: 5.0,
        }), // Should be grouped as 5 miles
        createMockWorkout({
          distance: 4.9,
        }), // Should be grouped as 5 miles
      ];

      const result = groupRunsByDistance({
        samples,
      });

      expect(Object.keys(result)).toHaveLength(2);
      expect(result[3]).toBeDefined();
      expect(result[5]).toBeDefined();
      expect(result[3].runs).toHaveLength(2);
      expect(result[5].runs).toHaveLength(2);
    });

    it('should create correct group titles with units', () => {
      const samples = [
        createMockWorkout({
          distance: 3.0, // Should be grouped as 3 miles
          unit: 'mi',
        }),
      ];

      const result = groupRunsByDistance({ samples });

      expect(result[3].title).toBe('3 mi');
    });

    it('should handle different distance units', () => {
      const samples = [
        createMockWorkout({
          distance: 5.1, // Should be grouped as 5 km
          unit: 'km',
        }),
      ];

      const result = groupRunsByDistance({ samples });

      expect(result[5].title).toBe('5 km');
    });
  });

  describe('tolerance behavior', () => {
    it('should use default tolerance of 0.25', () => {
      const samples = [
        createMockWorkout({
          distance: 3.25,
        }), // Within tolerance (0.25)
        createMockWorkout({
          distance: 3.26,
        }), // Outside tolerance (0.26 > 0.25)
      ];

      const result = groupRunsByDistance({ samples });

      expect(result[3]).toBeDefined();
      expect(result[3].runs).toHaveLength(1); // Only the first run should be included
    });

    it('should respect custom tolerance', () => {
      const samples = [
        createMockWorkout({
          distance: 3.1, // Within default tolerance (0.25)
        }), // Within default tolerance (0.25)
        createMockWorkout({
          distance: 3.35, // Outside default tolerance but within custom tolerance (0.35
          unit: 'mi',
        }), // Outside default tolerance but within 0.35
        createMockWorkout({
          distance: 3.7, // Outside both tolerances
          unit: 'mi',
        }), // Outside both tolerances
      ];

      const result = groupRunsByDistance({ samples, tolerance: 0.35 });

      expect(result[3]).toBeDefined();
      expect(result[3].runs).toHaveLength(1); // Only the first run should be included
    });

    it('should exclude runs outside tolerance', () => {
      const samples = [
        createMockWorkout({
          distance: 3.5, // Too far from 3 (0.5 > 0.25)
        }), // Too far from 3 (0.5 > 0.25) and from 4 (0.5 > 0.25)
      ];

      const result = groupRunsByDistance({ samples });

      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe('highlight selection', () => {
    it('should set the first run as initial highlight', () => {
      const samples = [
        createMockWorkout({
          distance: 3.1,
        }),
      ];

      const result = groupRunsByDistance({ samples });

      expect(result[3].highlight).toBe(samples[0]);
    });

    it('should set fastest run as highlight', () => {
      // Note: Lower pace values mean faster pace
      const samples = [
        createMockWorkout({
          distance: 3.0,
          averagePace: 8.1, // slower pace
          unit: 'mi',
        }), // slower pace
        createMockWorkout({
          distance: 3.2,
          averagePace: 7.0, // faster pace
          unit: 'mi',
        }),
      ];

      const result = groupRunsByDistance({ samples });

      // Should select the run with faster pace (7.0 min/mile)
      expect(result[3].highlight).toBe(samples[1]);
    });

    it('should handle runs without pace gracefully', () => {
      const samples = [
        createMockWorkout({
          distance: 3.1,
          averagePace: 8.0,
          unit: 'mi',
        }), // has pace
        createMockWorkoutWithoutPace(),
      ];

      const result = groupRunsByDistance({ samples });

      // Should select the run with pace since the other doesn't have pace
      expect(result[3].highlight).toBe(samples[0]);
    });

    it('should prefer runs with pace over runs without pace', () => {
      const samples = [
        createMockWorkoutWithoutPace(), // no pace
        createMockWorkout({
          distance: 3.2,
          averagePace: 8.0,
          unit: 'mi',
        }), // has pace
      ];

      const result = groupRunsByDistance({ samples });

      // Should select the run with pace
      expect(result[3].highlight).toBe(samples[1]);
    });

    it('should handle equal paces by keeping first run', () => {
      const samples = [
        createMockWorkout({
          distance: 3.1,
          averagePace: 8.0,
          unit: 'mi',
        }), // same pace
        createMockWorkout({
          distance: 3.2,
          averagePace: 8.0,
          unit: 'mi',
        }), // same pace
      ];

      const result = groupRunsByDistance({ samples });

      // Should keep the first run when paces are equal
      expect(result[3].highlight).toBe(samples[0]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = groupRunsByDistance({
        samples: [],
      });

      expect(result).toEqual({});
    });

    it('should handle single run', () => {
      const samples = [
        createMockWorkout({
          distance: 5.0,
          averagePace: 8.0,
          unit: 'mi',
        }),
      ];

      const result = groupRunsByDistance({ samples });

      expect(Object.keys(result)).toHaveLength(1);
      expect(result[5].runs).toHaveLength(1);
      expect(result[5].highlight).toBe(samples[0]);
    });

    it('should handle runs with zero distance', () => {
      const samples = [
        createMockWorkout({
          distance: 0.0,
          averagePace: 8.0,
          unit: 'mi',
        }),
      ];

      const result = groupRunsByDistance({ samples });

      expect(result[0]).toBeDefined();
      expect(result[0].runs).toHaveLength(1);
    });

    it('should handle negative distances (edge case)', () => {
      const samples = [
        createMockWorkout({
          distance: -1.0,
          averagePace: 8.0,
          unit: 'mi',
        }),
      ];

      const result = groupRunsByDistance({ samples });

      expect(result[-1]).toBeDefined();
      expect(result[-1].runs).toHaveLength(1);
    });

    it('should handle very large distances', () => {
      const samples = [
        createMockWorkout({
          distance: 26.2,
          averagePace: 8.0,
          unit: 'mi',
        }),
      ]; // Marathon distance

      const result = groupRunsByDistance({ samples });

      expect(result[26]).toBeDefined();
      expect(result[26].runs).toHaveLength(1);
    });
  });

  describe('multiple runs per group', () => {
    it('should handle multiple runs in the same group', () => {
      const samples = [
        createMockWorkout({
          distance: 5.0,
          averagePace: 8.0,
          unit: 'mi',
        }),
        createMockWorkout({
          distance: 5.1,
          averagePace: 8.1,
          unit: 'mi',
        }),
        createMockWorkout({
          distance: 4.9,
          averagePace: 7.9,
          unit: 'mi',
        }),
        createMockWorkout({
          distance: 5.2,
          averagePace: 8.2,
          unit: 'mi',
        }),
      ];

      const result = groupRunsByDistance({ samples });

      expect(result[5].runs).toHaveLength(4);
      expect(result[5].runs).toContain(samples[0]);
      expect(result[5].runs).toContain(samples[1]);
      expect(result[5].runs).toContain(samples[2]);
      expect(result[5].runs).toContain(samples[3]);
    });
  });

  // describe('console warnings', () => {
  //   let consoleSpy: jest.SpyInstance;

  //   beforeEach(() => {
  //     consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
  //   });

  //   afterEach(() => {
  //     consoleSpy.mockRestore();
  //   });

  //   it('should log warning for runs outside tolerance', () => {
  //     const samples = [
  //       createMockWorkout({
  //         distance: 3.5,
  //       }),
  //     ]; // Outside default tolerance

  //     groupRunsByDistance({ samples });

  //     expect(consoleSpy).toHaveBeenCalledWith(
  //       expect.stringContaining(
  //         'Run with distance 3.5 is not close enough to a whole number. Skipping.',
  //       ),
  //     );
  //   });

  //   it('should not log warning for runs within tolerance', () => {
  //     const samples = [
  //       createMockWorkout({
  //         distance: 3.2,
  //       }),
  //     ]; // Within tolerance

  //     groupRunsByDistance({ samples });

  //     expect(consoleSpy).not.toHaveBeenCalled();
  //   });
  // });
});
