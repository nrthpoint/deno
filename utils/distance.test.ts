import { Quantity } from '@kingstinct/react-native-healthkit';

import { formatDistance, metersToKilometers, metersToMiles } from './distance';

describe('Distance Utilities', () => {
  describe('formatDistance', () => {
    it('should format distance with default decimal places', () => {
      const distance: Quantity = { unit: 'km', quantity: 5.248 };
      expect(formatDistance(distance)).toBe('5.2 km');
    });

    it('should format distance with custom decimal places', () => {
      const distance: Quantity = { unit: 'mi', quantity: 3.14159 };
      expect(formatDistance(distance, 2)).toBe('3.14 mi');
    });

    it('should handle zero distance', () => {
      const distance: Quantity = { unit: 'm', quantity: 0 };
      expect(formatDistance(distance)).toBe('0 m');
    });

    it('should handle missing unit', () => {
      const distance: Quantity = { unit: '', quantity: 1000 };
      expect(formatDistance(distance)).toBe('1000.0 m');
    });

    it('should handle invalid input', () => {
      expect(formatDistance(null as any)).toBe('0 m');
      expect(formatDistance({ unit: 'km', quantity: NaN })).toBe('0 m');
      expect(formatDistance({ unit: 'km', quantity: -5 })).toBe('0 m');
    });
  });

  describe('metersToMiles', () => {
    it('should convert meters to miles correctly', () => {
      const input: Quantity = {
        unit: 'm',
        quantity: 1609.344, // 1 mile in meters
      };

      const result = metersToMiles(input);

      expect(result.unit).toBe('mi');
      expect(result.quantity).toBeCloseTo(1, 3); // 1 mile
    });

    it('should convert 5000 meters to miles', () => {
      const input: Quantity = {
        unit: 'm',
        quantity: 5000,
      };

      const result = metersToMiles(input);

      expect(result.unit).toBe('mi');
      expect(result.quantity).toBeCloseTo(3.10686, 3); // ~3.11 miles
    });

    it('should handle zero meters', () => {
      const input: Quantity = {
        unit: 'm',
        quantity: 0,
      };

      const result = metersToMiles(input);

      expect(result.unit).toBe('mi');
      expect(result.quantity).toBe(0);
    });

    it('should preserve original object and return new one', () => {
      const input: Quantity = {
        unit: 'm',
        quantity: 1000,
      };

      const result = metersToMiles(input);

      expect(input.unit).toBe('m'); // Original unchanged
      expect(input.quantity).toBe(1000); // Original unchanged
      expect(result).not.toBe(input); // Different object
    });
  });

  describe('metersToKilometers', () => {
    it('should convert meters to kilometers correctly', () => {
      const input: Quantity = {
        unit: 'm',
        quantity: 1000,
      };

      const result = metersToKilometers(input);

      expect(result.unit).toBe('km');
      expect(result.quantity).toBe(1); // 1 kilometer
    });

    it('should convert 5000 meters to kilometers', () => {
      const input: Quantity = {
        unit: 'm',
        quantity: 5000,
      };

      const result = metersToKilometers(input);

      expect(result.unit).toBe('km');
      expect(result.quantity).toBe(5); // 5 kilometers
    });

    it('should handle decimal conversions', () => {
      const input: Quantity = {
        unit: 'm',
        quantity: 1500,
      };

      const result = metersToKilometers(input);

      expect(result.unit).toBe('km');
      expect(result.quantity).toBe(1.5); // 1.5 kilometers
    });

    it('should handle zero meters', () => {
      const input: Quantity = {
        unit: 'm',
        quantity: 0,
      };

      const result = metersToKilometers(input);

      expect(result.unit).toBe('km');
      expect(result.quantity).toBe(0);
    });

    it('should preserve original object and return new one', () => {
      const input: Quantity = {
        unit: 'm',
        quantity: 2000,
      };

      const result = metersToKilometers(input);

      expect(input.unit).toBe('m'); // Original unchanged
      expect(input.quantity).toBe(2000); // Original unchanged
      expect(result).not.toBe(input); // Different object
    });
  });
});
