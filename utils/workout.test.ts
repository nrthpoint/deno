import { WorkoutSample, Quantity } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';

import { formatPace } from './time';
import {
  calculatePace,
  getMostFrequentDuration,
  getMostFrequentHumidity,
  getMostFrequentPace,
} from './workout';

describe('Workout Utilities', () => {
  describe('formatPace', () => {
    it('should format whole minute paces correctly with units', () => {
      expect(formatPace({ quantity: 7, unit: 'min/mi' } as Quantity)).toBe('7:00 min/mi');
      expect(formatPace({ quantity: 8, unit: 'min/km' } as Quantity)).toBe('8:00 min/km');
    });

    it('should format decimal paces correctly with units', () => {
      expect(formatPace({ quantity: 6.5, unit: 'min/mi' } as Quantity)).toBe('6:30 min/mi'); // 6.5 minutes = 6:30
      expect(formatPace({ quantity: 7.25, unit: 'min/km' } as Quantity)).toBe('7:15 min/km'); // 7.25 minutes = 7:15
      expect(formatPace({ quantity: 8.75, unit: 'min/mi' } as Quantity)).toBe('8:45 min/mi'); // 8.75 minutes = 8:45
    });

    it('should handle complex decimal paces with units', () => {
      expect(formatPace({ quantity: 6.67, unit: 'min/mi' } as Quantity)).toBe('6:40 min/mi'); // 6.67 minutes ≈ 6:40
      expect(formatPace({ quantity: 7.33, unit: 'min/km' } as Quantity)).toBe('7:20 min/km'); // 7.33 minutes ≈ 7:20
      expect(formatPace({ quantity: 9.17, unit: 'min/mi' } as Quantity)).toBe('9:10 min/mi'); // 9.17 minutes ≈ 9:10
    });

    it('should handle fast paces', () => {
      expect(formatPace({ quantity: 4.5, unit: 'min/mi' } as Quantity)).toBe('4:30 min/mi');
      expect(formatPace({ quantity: 5.83, unit: 'min/km' } as Quantity)).toBe('5:50 min/km');
    });

    it('should handle slow paces', () => {
      expect(formatPace({ quantity: 12.5, unit: 'min/mi' } as Quantity)).toBe('12:30 min/mi');
      expect(formatPace({ quantity: 15.25, unit: 'min/km' } as Quantity)).toBe('15:15 min/km');
    });

    it('should handle edge cases', () => {
      expect(formatPace({ quantity: 0, unit: 'min/mi' } as Quantity)).toBe('0:00 min/mi');
      expect(formatPace({ quantity: 0.5, unit: 'min/km' } as Quantity)).toBe('0:30 min/km');
      expect(formatPace({ quantity: 0.1, unit: 'min/mi' } as Quantity)).toBe('0:06 min/mi');
    });

    it('should handle invalid inputs gracefully', () => {
      expect(() => formatPace({ quantity: NaN, unit: 'min/mi' } as Quantity)).toThrow(
        'Pace quantity must be a valid non-negative number',
      );
      expect(() => formatPace({ quantity: -1, unit: 'min/km' } as Quantity)).toThrow(
        'Pace quantity must be a valid non-negative number',
      );

      expect(() => formatPace(null as any)).toThrow(
        'Pace quantity must be a valid non-negative number',
      );
      expect(() => formatPace(undefined as any)).toThrow(
        'Pace quantity must be a valid non-negative number',
      );
    });

    it('should handle missing or malformed units', () => {
      expect(() => formatPace({ quantity: 7.5, unit: '' } as Quantity)).toThrow(
        'formatPace: Pace must be in "min/mi" or "min/km" format',
      );
      expect(() => formatPace({ quantity: 8.25, unit: undefined } as unknown as Quantity)).toThrow(
        'formatPace: Pace must be in "min/mi" or "min/km" format',
      );
      expect(() => formatPace({ quantity: 6.67, unit: 'invalid' } as Quantity)).toThrow(
        'formatPace: Pace must be in "min/mi" or "min/km" format',
      );
    });

    it('should pad seconds with leading zero', () => {
      expect(formatPace({ quantity: 7.08, unit: 'min/mi' } as Quantity)).toBe('7:05 min/mi'); // 7.08 minutes ≈ 7:05
      expect(formatPace({ quantity: 8.02, unit: 'min/km' } as Quantity)).toBe('8:01 min/km'); // 8.02 minutes ≈ 8:01
    });
  });

  describe('calculatePace', () => {
    it('should calculate pace correctly for a run in kilometers', () => {
      const mockRun = {
        totalDistance: { unit: 'km', quantity: 5 } as Quantity,
        duration: { unit: 'm', quantity: 25 } as Quantity, // 25 minutes
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe('min/km');
      expect(result.quantity).toBe(5); // 25 minutes / 5 km = 5 min/km
    });

    it('should calculate pace correctly for a run in miles', () => {
      const mockRun = {
        totalDistance: { unit: 'mi', quantity: 3 } as Quantity,
        duration: { unit: 'm', quantity: 24 } as Quantity, // 24 minutes
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe('min/mi');
      expect(result.quantity).toBe(8); // 24 minutes / 3 miles = 8 min/mile
    });

    it('should handle duration in seconds', () => {
      const mockRun = {
        totalDistance: { unit: 'km', quantity: 2 } as Quantity,
        duration: { unit: 's', quantity: 600 } as Quantity, // 600 seconds = 10 minutes
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe('min/km');
      expect(result.quantity).toBe(5); // 10 minutes / 2 km = 5 min/km
    });

    it('should handle zero distance gracefully', () => {
      const mockRun = {
        totalDistance: { unit: 'km', quantity: 0 } as Quantity,
        duration: { unit: 'm', quantity: 30 } as Quantity,
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe('min/km');
      expect(result.quantity).toBe(0);
    });

    it('should handle missing distance gracefully', () => {
      const mockRun = {
        totalDistance: undefined,
        duration: { unit: 'm', quantity: 30 } as Quantity,
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe('min/undefined');
      expect(result.quantity).toBe(0);
    });

    it('should round pace to 2 decimal places', () => {
      const mockRun = {
        totalDistance: { unit: 'km', quantity: 3 } as Quantity,
        duration: { unit: 'm', quantity: 20 } as Quantity, // 20 minutes
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe('min/km');
      expect(result.quantity).toBe(6.67); // 20 / 3 = 6.666... rounded to 6.67
    });

    it('should handle fractional distances', () => {
      const mockRun = {
        totalDistance: { unit: 'mi', quantity: 1.5 } as Quantity,
        duration: { unit: 'm', quantity: 12 } as Quantity, // 12 minutes
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe('min/mi');
      expect(result.quantity).toBe(8); // 12 / 1.5 = 8 min/mile
    });
  });

  describe('calculatePace and formatPace integration', () => {
    it('should work together to provide both decimal and formatted pace', () => {
      const mockRun = {
        totalDistance: { unit: 'km', quantity: 3 } as Quantity,
        duration: { unit: 'm', quantity: 20 } as Quantity, // 20 minutes
      } as WorkoutSample;

      const pace = calculatePace(mockRun);
      const formattedPace = formatPace(pace);

      expect(pace.quantity).toBe(6.67); // Decimal pace
      expect(formattedPace).toBe('6:40 min/km'); // Formatted pace with full unit
    });

    it('should handle whole minute paces', () => {
      const mockRun = {
        totalDistance: { unit: 'mi', quantity: 2 } as Quantity,
        duration: { unit: 'm', quantity: 16 } as Quantity, // 16 minutes
      } as WorkoutSample;

      const pace = calculatePace(mockRun);
      const formattedPace = formatPace(pace);

      expect(pace.quantity).toBe(8); // Exactly 8 min/mile
      expect(formattedPace).toBe('8:00 min/mi'); // Formatted with full unit
    });
  });

  describe('getMostFrequentPace', () => {
    const createMockWorkout = (pace: number, unit = 'min/mi'): ExtendedWorkout =>
      ({
        averagePace: { quantity: pace, unit },
        duration: { quantity: 1800, unit: 's' },
        humidity: { quantity: 50, unit: '%' },
      }) as ExtendedWorkout;

    it('should return the most frequent pace', () => {
      const runs = [
        createMockWorkout(7.0), // appears once
        createMockWorkout(8.0), // appears twice
        createMockWorkout(8.0),
        createMockWorkout(9.0), // appears once
      ];

      const result = getMostFrequentPace(runs);

      expect(result.quantity).toBe(8.0);
      expect(result.unit).toBe('min/mi');
    });

    it('should handle empty array', () => {
      const result = getMostFrequentPace([]);

      expect(result.quantity).toBe(0);
      expect(result.unit).toBe('min/mi');
    });

    it('should handle single workout', () => {
      const runs = [createMockWorkout(7.5)];

      const result = getMostFrequentPace(runs);

      expect(result.quantity).toBe(7.5);
      expect(result.unit).toBe('min/mi');
    });

    it('should group similar paces by rounding to nearest second', () => {
      const runs = [
        createMockWorkout(7.4), // rounds to 7
        createMockWorkout(7.6), // rounds to 8
        createMockWorkout(7.3), // rounds to 7
        createMockWorkout(8.2), // rounds to 8
      ];

      const result = getMostFrequentPace(runs);

      // Should return one of the workouts that rounded to 7 (7.4 or 7.3)
      expect([7.3, 7.4]).toContain(result.quantity);
      expect(result.unit).toBe('min/mi');
    });

    it('should handle tie by returning the first encountered pace', () => {
      const runs = [
        createMockWorkout(7.0), // appears once
        createMockWorkout(8.0), // appears once
      ];

      const result = getMostFrequentPace(runs);

      expect(result.quantity).toBe(7.0); // First one should win the tie
      expect(result.unit).toBe('min/mi');
    });

    it('should preserve original units', () => {
      const runs = [
        createMockWorkout(4.5, 'min/km'),
        createMockWorkout(4.5, 'min/km'),
        createMockWorkout(5.0, 'min/km'),
      ];

      const result = getMostFrequentPace(runs);

      expect(result.quantity).toBe(4.5);
      expect(result.unit).toBe('min/km');
    });
  });

  describe('getMostFrequentDuration', () => {
    const createMockWorkout = (durationMinutes: number): ExtendedWorkout =>
      ({
        duration: { quantity: durationMinutes * 60, unit: 's' }, // Convert to seconds
        averagePace: { quantity: 8, unit: 'min/mi' },
        humidity: { quantity: 50, unit: '%' },
      }) as ExtendedWorkout;

    it('should return the most frequent duration', () => {
      const runs = [
        createMockWorkout(30), // 30 minutes, appears twice
        createMockWorkout(30),
        createMockWorkout(45), // 45 minutes, appears once
        createMockWorkout(25), // 25 minutes, appears once
      ];

      const result = getMostFrequentDuration(runs);

      expect(result.quantity).toBe(1800); // 30 minutes = 1800 seconds
      expect(result.unit).toBe('s');
    });

    it('should handle empty array', () => {
      const result = getMostFrequentDuration([]);

      expect(result.quantity).toBe(0);
      expect(result.unit).toBe('s');
    });

    it('should handle single workout', () => {
      const runs = [createMockWorkout(25)];

      const result = getMostFrequentDuration(runs);

      expect(result.quantity).toBe(1500); // 25 minutes = 1500 seconds
      expect(result.unit).toBe('s');
    });

    it('should group similar durations by rounding to nearest minute', () => {
      const runs = [
        { duration: { quantity: 1770, unit: 's' } } as ExtendedWorkout, // 29.5 min → rounds to 30 min
        { duration: { quantity: 1830, unit: 's' } } as ExtendedWorkout, // 30.5 min → rounds to 30 min
        { duration: { quantity: 2700, unit: 's' } } as ExtendedWorkout, // 45 min → rounds to 45 min
      ];

      const result = getMostFrequentDuration(runs);

      // Should return one of the durations that rounded to 30 minutes (1800 seconds)
      expect([1770, 1830]).toContain(result.quantity);
      expect(result.unit).toBe('s');
    });

    it('should handle fractional minutes correctly', () => {
      const runs = [
        createMockWorkout(29.7), // 29.7 min → rounds to 30 min
        createMockWorkout(30.3), // 30.3 min → rounds to 30 min
        createMockWorkout(32.0), // 32 min → rounds to 32 min
      ];

      const result = getMostFrequentDuration(runs);

      // Should return one of the durations that rounded to 30 minutes
      expect([1782, 1818]).toContain(result.quantity); // 29.7*60=1782, 30.3*60=1818
      expect(result.unit).toBe('s');
    });
  });

  describe('getMostFrequentHumidity', () => {
    const createMockWorkout = (humidity: number): ExtendedWorkout =>
      ({
        humidity: { quantity: humidity, unit: '%' },
        duration: { quantity: 1800, unit: 's' },
        averagePace: { quantity: 8, unit: 'min/mi' },
      }) as ExtendedWorkout;

    it('should return the most frequent humidity', () => {
      const runs = [
        createMockWorkout(60), // appears twice
        createMockWorkout(60),
        createMockWorkout(70), // appears once
        createMockWorkout(50), // appears once
      ];

      const result = getMostFrequentHumidity(runs);

      expect(result.quantity).toBe(60);
      expect(result.unit).toBe('%');
    });

    it('should handle empty array', () => {
      const result = getMostFrequentHumidity([]);

      expect(result.quantity).toBe(0);
      expect(result.unit).toBe('%');
    });

    it('should handle single workout', () => {
      const runs = [createMockWorkout(65)];

      const result = getMostFrequentHumidity(runs);

      expect(result.quantity).toBe(65);
      expect(result.unit).toBe('%');
    });

    it('should filter out runs with no humidity data', () => {
      const runs = [
        createMockWorkout(60),
        { humidity: { quantity: 0, unit: '%' } } as ExtendedWorkout, // Should be filtered out
        { humidity: undefined } as unknown as ExtendedWorkout, // Should be filtered out
        createMockWorkout(60),
      ];

      const result = getMostFrequentHumidity(runs);

      expect(result.quantity).toBe(60);
      expect(result.unit).toBe('%');
    });

    it('should return 0% when no valid humidity data exists', () => {
      const runs = [
        { humidity: { quantity: 0, unit: '%' } } as ExtendedWorkout,
        { humidity: undefined } as unknown as ExtendedWorkout,
      ];

      const result = getMostFrequentHumidity(runs);

      expect(result.quantity).toBe(0);
      expect(result.unit).toBe('%');
    });

    it('should group similar humidity values by rounding to nearest 5%', () => {
      const runs = [
        createMockWorkout(57), // rounds to 55
        createMockWorkout(58), // rounds to 60
        createMockWorkout(53), // rounds to 55
        createMockWorkout(62), // rounds to 60
      ];

      const result = getMostFrequentHumidity(runs);

      // Should return one of the humidity values that rounds to either 55 or 60
      // Both groups have 2 items, so it should return the first encountered
      expect([53, 57]).toContain(result.quantity);
      expect(result.unit).toBe('%');
    });

    it('should handle humidity values at rounding boundaries', () => {
      const runs = [
        createMockWorkout(62.5), // exactly between 60 and 65, should round to 65
        createMockWorkout(67.5), // exactly between 65 and 70, should round to 70
        createMockWorkout(65), // exactly 65
      ];

      const result = getMostFrequentHumidity(runs);

      // Each value rounds to a different bucket, so first one should win
      expect(result.quantity).toBe(62.5);
      expect(result.unit).toBe('%');
    });
  });
});
