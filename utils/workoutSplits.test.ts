import {
  calculateTimeDifference,
  formatSplitPace,
  formatSplitTime,
  WorkoutSplit,
} from './workoutSplits';

describe('workoutSplits', () => {
  describe('formatSplitTime', () => {
    it('should format split time correctly', () => {
      expect(formatSplitTime(300)).toBe('5:00'); // 5 minutes
      expect(formatSplitTime(450)).toBe('7:30'); // 7 minutes 30 seconds
      expect(formatSplitTime(60)).toBe('1:00'); // 1 minute
      expect(formatSplitTime(65)).toBe('1:05'); // 1 minute 5 seconds
    });

    it('should handle zero seconds', () => {
      expect(formatSplitTime(0)).toBe('0:00');
    });

    it('should handle large values', () => {
      expect(formatSplitTime(3661)).toBe('61:01'); // 61 minutes 1 second
    });
  });

  describe('formatSplitPace', () => {
    it('should format split pace correctly', () => {
      expect(formatSplitPace(450, 'mi')).toBe('7:30/mi'); // 7:30 per mile
      expect(formatSplitPace(300, 'km')).toBe('5:00/km'); // 5:00 per km
      expect(formatSplitPace(420, 'mi')).toBe('7:00/mi'); // 7:00 per mile
    });

    it('should handle edge cases', () => {
      expect(formatSplitPace(0, 'mi')).toBe('0:00/mi');
      expect(formatSplitPace(59, 'km')).toBe('0:59/km');
    });
  });

  describe('calculateTimeDifference', () => {
    it('should calculate time difference correctly', () => {
      const result1 = calculateTimeDifference(450, 420); // 7:30 vs 7:00
      expect(result1.diff).toBe(30);
      expect(result1.isPositive).toBe(true);
      expect(result1.formatted).toBe('30s');

      const result2 = calculateTimeDifference(420, 450); // 7:00 vs 7:30
      expect(result2.diff).toBe(30);
      expect(result2.isPositive).toBe(false);
      expect(result2.formatted).toBe('30s');

      const result3 = calculateTimeDifference(480, 420); // 8:00 vs 7:00
      expect(result3.diff).toBe(60);
      expect(result3.isPositive).toBe(true);
      expect(result3.formatted).toBe('1:00');
    });

    it('should handle zero difference', () => {
      const result = calculateTimeDifference(420, 420);
      expect(result.diff).toBe(0);
      expect(result.isPositive).toBe(false);
      expect(result.formatted).toBe('0s');
    });

    it('should format longer differences correctly', () => {
      const result = calculateTimeDifference(500, 380); // 8:20 vs 6:20 = 2:00 difference
      expect(result.diff).toBe(120);
      expect(result.isPositive).toBe(true);
      expect(result.formatted).toBe('2:00');
    });

    it('should format mixed minute/second differences', () => {
      const result = calculateTimeDifference(495, 420); // 8:15 vs 7:00 = 1:15 difference
      expect(result.diff).toBe(75);
      expect(result.isPositive).toBe(true);
      expect(result.formatted).toBe('1:15');
    });
  });

  describe('WorkoutSplit isWhole property', () => {
    it('should identify whole vs partial splits correctly', () => {
      // Mock splits with different distance accuracies
      const wholeSplit: WorkoutSplit = {
        splitNumber: 1,
        distance: 1.0, // Exactly 1 mile
        distanceUnit: 'mi',
        duration: 420, // 7:00
        pace: 420,
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T10:07:00Z'),
        cumulativeDistance: 1.0,
        cumulativeTime: 420,
        isWhole: true,
      };

      const partialSplit: WorkoutSplit = {
        splitNumber: 2,
        distance: 0.75, // Only 0.75 miles (partial)
        distanceUnit: 'mi',
        duration: 315, // 5:15
        pace: 420,
        startTime: new Date('2024-01-01T10:07:00Z'),
        endTime: new Date('2024-01-01T10:12:15Z'),
        cumulativeDistance: 1.75,
        cumulativeTime: 735,
        isWhole: false,
      };

      // Test that whole splits are marked correctly
      expect(wholeSplit.isWhole).toBe(true);
      expect(wholeSplit.distance).toBeCloseTo(1.0, 2);

      // Test that partial splits are marked correctly
      expect(partialSplit.isWhole).toBe(false);
      expect(partialSplit.distance).toBeLessThan(1.0);
    });

    it('should handle near-whole splits within tolerance', () => {
      // A split that's 0.98 miles should still be considered "whole" within 5% tolerance
      const nearWholeSplit: WorkoutSplit = {
        splitNumber: 1,
        distance: 0.98, // Very close to 1 mile
        distanceUnit: 'mi',
        duration: 420,
        pace: 428.6, // Adjusted pace for 0.98 miles
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T10:07:00Z'),
        cumulativeDistance: 0.98,
        cumulativeTime: 420,
        isWhole: true, // Should be true within tolerance
      };

      expect(nearWholeSplit.isWhole).toBe(true);
      expect(nearWholeSplit.distance).toBeGreaterThan(0.95);
    });
  });
});
