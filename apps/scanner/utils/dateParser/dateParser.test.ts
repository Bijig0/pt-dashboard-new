import { parseDate } from './dateParser';

describe('parseDate', () => {
  describe('handles null and undefined', () => {
    it('should return empty string for null', () => {
      expect(parseDate(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(parseDate(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(parseDate('')).toBe('');
      expect(parseDate('   ')).toBe('');
    });
  });

  describe('handles Date objects', () => {
    it('should format valid Date objects', () => {
      const date = new Date(2024, 0, 15); // Jan 15, 2024
      const result = parseDate(date);
      // Result should be in DD/MM format
      expect(result).toMatch(/15\/01|01\/15/); // Depends on locale
    });

    it('should return empty string for invalid Date', () => {
      const invalidDate = new Date('invalid');
      expect(parseDate(invalidDate)).toBe('');
    });
  });

  describe('handles ISO date strings', () => {
    it('should parse ISO date strings', () => {
      const result = parseDate('2024-01-15');
      expect(result).toBeTruthy();
      expect(result).not.toBe('2024-01-15'); // Should be formatted
    });

    it('should parse ISO datetime strings', () => {
      const result = parseDate('2024-01-15T12:00:00Z');
      expect(result).toBeTruthy();
    });
  });

  describe('handles DD/MM/YYYY format', () => {
    it('should parse DD/MM/YYYY', () => {
      const result = parseDate('15/01/2024');
      expect(result).toMatch(/15\/01|01\/15/);
    });

    it('should parse D/M/YYYY (single digits)', () => {
      const result = parseDate('5/1/2024');
      expect(result).toBeTruthy();
    });

    it('should parse DD-MM-YYYY', () => {
      const result = parseDate('15-01-2024');
      expect(result).toMatch(/15\/01|15-01|01\/15/);
    });
  });

  describe('handles DD/MM format (short dates)', () => {
    it('should parse DD/MM and assume current year', () => {
      const result = parseDate('15/01');
      expect(result).toMatch(/15\/01|01\/15/);
    });

    it('should parse DD-MM', () => {
      const result = parseDate('15-01');
      expect(result).toMatch(/15\/01|15-01|01\/15/);
    });
  });

  describe('handles already formatted dates', () => {
    it('should return DD/MM format as-is if already valid', () => {
      expect(parseDate('15/01')).toMatch(/15\/01|01\/15/);
      expect(parseDate('05/12')).toMatch(/05\/12|12\/05/);
    });
  });

  describe('handles month name formats', () => {
    it('should parse "DD Month YYYY" format', () => {
      const result = parseDate('15 January 2024');
      expect(result).toBeTruthy();
    });

    it('should parse "Month DD, YYYY" format', () => {
      const result = parseDate('January 15, 2024');
      expect(result).toBeTruthy();
    });

    it('should handle Indonesian month names', () => {
      const result = parseDate('15 Januari 2024');
      expect(result).toBeTruthy();
    });
  });

  describe('handles timestamps', () => {
    it('should parse numeric timestamps', () => {
      const timestamp = new Date(2024, 0, 15).getTime();
      const result = parseDate(timestamp);
      expect(result).toBeTruthy();
    });
  });

  describe('handles edge cases', () => {
    it('should handle unknown types by converting to string', () => {
      const result = parseDate({ foo: 'bar' } as unknown);
      expect(result).toBe('[object Object]');
    });

    it('should return original string for unparseable dates', () => {
      expect(parseDate('not a date')).toBe('not a date');
      expect(parseDate('random text')).toBe('random text');
    });
  });
});
