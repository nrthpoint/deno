import { formatDuration, convertDurationToMinutes } from './time';
import { Quantity } from '@kingstinct/react-native-healthkit';

describe('Time Utilities', () => {
  describe('formatDuration', () => {
    it('should format seconds correctly with hours, minutes, seconds format', () => {
      const result = formatDuration({ unit: 's', quantity: 125 }); // 2 minutes 5 seconds
      expect(result).toBe('2min 5s');
    });

    it('should format hours, minutes, and seconds correctly', () => {
      const result = formatDuration({ unit: 's', quantity: 3665 }); // 1 hour 1 minute 5 seconds
      expect(result).toBe('1hr 1min 5s');
    });

    it('should handle zero seconds', () => {
      const result = formatDuration({ unit: 's', quantity: 0 });
      expect(result).toBe('0sec');
    });

    it('should handle exactly one minute', () => {
      const result = formatDuration({ unit: 's', quantity: 60 });
      expect(result).toBe('1min');
    });

    it('should handle exactly one hour', () => {
      const result = formatDuration({ unit: 's', quantity: 3600 });
      expect(result).toBe('1hr');
    });

    it('should handle only seconds', () => {
      const result = formatDuration({ unit: 's', quantity: 45 });
      expect(result).toBe('45s');
    });

    it('should handle minutes without hours', () => {
      const result = formatDuration({ unit: 's', quantity: 150 }); // 2 minutes 30 seconds
      expect(result).toBe('2min 30s');
    });

    it('should throw error for invalid unit', () => {
      expect(() => formatDuration({ unit: 'm', quantity: 60 })).toThrow(
        'formatDuration: Duration must be in seconds (unit: "s")',
      );
    });

    it('should throw error for negative duration', () => {
      expect(() => formatDuration({ unit: 's', quantity: -10 })).toThrow(
        'formatDuration: Duration quantity must be a valid non-negative number',
      );
    });

    it('should throw error for NaN duration', () => {
      expect(() => formatDuration({ unit: 's', quantity: NaN })).toThrow(
        'formatDuration: Duration quantity must be a valid non-negative number',
      );
    });
  });

  describe('convertDurationToMinutes', () => {
    it('should convert seconds to minutes correctly', () => {
      const input: Quantity = { unit: 's', quantity: 120 };
      const result = convertDurationToMinutes(input);
      expect(result).toBe(2);
    });

    it('should convert partial seconds to minutes correctly', () => {
      const input: Quantity = { unit: 's', quantity: 150 };
      const result = convertDurationToMinutes(input);
      expect(result).toBe(2.5);
    });

    it('should handle minutes unit', () => {
      const input: Quantity = { unit: 'm', quantity: 5 };
      const result = convertDurationToMinutes(input);
      expect(result).toBe(5);
    });

    it('should handle hours unit', () => {
      const input: Quantity = { unit: 'h', quantity: 2 };
      const result = convertDurationToMinutes(input);
      expect(result).toBe(120);
    });

    it('should handle zero duration', () => {
      const input: Quantity = { unit: 's', quantity: 0 };
      const result = convertDurationToMinutes(input);
      expect(result).toBe(0);
    });

    it('should handle undefined duration', () => {
      const result = convertDurationToMinutes(undefined as any);
      expect(result).toBe(0);
    });

    it('should handle null quantity', () => {
      const input: Quantity = { unit: 's', quantity: null as any };
      const result = convertDurationToMinutes(input);
      expect(result).toBe(0);
    });

    it('should handle unsupported unit and log warning', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const input: Quantity = { unit: 'unknown' as any, quantity: 100 };

      const result = convertDurationToMinutes(input);

      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('Unsupported duration unit:', 'unknown');

      consoleSpy.mockRestore();
    });
  });
});
