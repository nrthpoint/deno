import { Quantity } from '@kingstinct/react-native-healthkit';

import {
  formatDuration,
  formatDurationSeparate,
  convertDurationToMinutes,
  formatTimeMMSS,
} from './time';

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

  describe('formatDurationSeparate', () => {
    it('should format seconds correctly with separate values and units', () => {
      const result = formatDurationSeparate({ unit: 's', quantity: 125 }); // 2 minutes 5 seconds
      expect(result).toEqual([
        { displayValue: '2', unit: 'min' },
        { displayValue: '5', unit: 's' },
      ]);
    });

    it('should format hours, minutes, and seconds correctly', () => {
      const result = formatDurationSeparate({ unit: 's', quantity: 3665 }); // 1 hour 1 minute 5 seconds
      expect(result).toEqual([
        { displayValue: '1', unit: 'hr' },
        { displayValue: '1', unit: 'min' },
        { displayValue: '5', unit: 's' },
      ]);
    });

    it('should handle zero seconds', () => {
      const result = formatDurationSeparate({ unit: 's', quantity: 0 });
      expect(result).toEqual([{ displayValue: '0', unit: 's' }]);
    });

    it('should handle exactly one minute', () => {
      const result = formatDurationSeparate({ unit: 's', quantity: 60 });
      expect(result).toEqual([{ displayValue: '1', unit: 'min' }]);
    });

    it('should handle exactly one hour', () => {
      const result = formatDurationSeparate({ unit: 's', quantity: 3600 });
      expect(result).toEqual([{ displayValue: '1', unit: 'hr' }]);
    });

    it('should handle only seconds', () => {
      const result = formatDurationSeparate({ unit: 's', quantity: 45 });
      expect(result).toEqual([{ displayValue: '45', unit: 's' }]);
    });

    it('should handle minutes without hours', () => {
      const result = formatDurationSeparate({ unit: 's', quantity: 150 }); // 2 minutes 30 seconds
      expect(result).toEqual([
        { displayValue: '2', unit: 'min' },
        { displayValue: '30', unit: 's' },
      ]);
    });

    it('should throw error for invalid unit', () => {
      expect(() => formatDurationSeparate({ unit: 'm', quantity: 60 })).toThrow(
        'formatDurationSeparate: Duration must be in seconds (unit: "s")',
      );
    });

    it('should throw error for negative duration', () => {
      expect(() => formatDurationSeparate({ unit: 's', quantity: -10 })).toThrow(
        'formatDurationSeparate: Duration quantity must be a valid non-negative number',
      );
    });

    it('should throw error for NaN duration', () => {
      expect(() => formatDurationSeparate({ unit: 's', quantity: NaN })).toThrow(
        'formatDurationSeparate: Duration quantity must be a valid non-negative number',
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

  describe('formatTimeMMSS', () => {
    it('should format time correctly in MM:SS format', () => {
      expect(formatTimeMMSS(125)).toBe('2:05');
      expect(formatTimeMMSS(60)).toBe('1:00');
      expect(formatTimeMMSS(59)).toBe('0:59');
      expect(formatTimeMMSS(0)).toBe('0:00');
    });

    it('should handle large numbers correctly', () => {
      expect(formatTimeMMSS(3661)).toBe('61:01'); // 1 hour 1 minute 1 second
    });

    it('should handle edge cases', () => {
      expect(formatTimeMMSS(-5)).toBe('0:00');
      expect(formatTimeMMSS(NaN)).toBe('0:00');
    });

    it('should pad seconds with leading zero', () => {
      expect(formatTimeMMSS(65)).toBe('1:05');
      expect(formatTimeMMSS(5)).toBe('0:05');
    });
  });
});
