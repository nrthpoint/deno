import { formatPace } from './time';
import { calculatePace } from './workout';
import { WorkoutSample, Quantity } from '@kingstinct/react-native-healthkit';

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
      expect(formatPace({ quantity: 0, unit: 'min/mi' } as Quantity)).toBe('0:00');
      expect(formatPace({ quantity: 0.5, unit: 'min/km' } as Quantity)).toBe('0:30 min/km');
      expect(formatPace({ quantity: 0.1, unit: 'min/mi' } as Quantity)).toBe('0:06 min/mi');
    });

    it('should handle invalid inputs gracefully', () => {
      expect(formatPace({ quantity: NaN, unit: 'min/mi' } as Quantity)).toBe('0:00');
      expect(formatPace({ quantity: -1, unit: 'min/km' } as Quantity)).toBe('0:00');
      expect(formatPace(null as any)).toBe('0:00');
      expect(formatPace(undefined as any)).toBe('0:00');
    });

    it('should handle missing or malformed units', () => {
      expect(formatPace({ quantity: 7.5, unit: '' } as Quantity)).toBe('7:30');
      expect(formatPace({ quantity: 8.25, unit: undefined } as unknown as Quantity)).toBe('8:15');
      expect(formatPace({ quantity: 6.67, unit: 'invalid' } as Quantity)).toBe('6:40 invalid');
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
});
