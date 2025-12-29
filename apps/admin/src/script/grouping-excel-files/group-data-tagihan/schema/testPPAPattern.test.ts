import { testPPAPattern } from './testPPAPattern.js';

describe('testPPAPattern', () => {
  it('should return true for strings that start with digits followed by a /', () => {
    expect(testPPAPattern('2024/')).toBe(true);
    expect(testPPAPattern('1234/')).toBe(true);
    expect(testPPAPattern('0001/')).toBe(true);
    expect(testPPAPattern('9999/')).toBe(true);
    expect(testPPAPattern('5678/anything')).toBe(true); // Now accepts anything after the /
  });

  it('should return false for strings that do not start with digits', () => {
    expect(testPPAPattern('abcd/')).toBe(false);
    expect(testPPAPattern('/abcd')).toBe(false);
    expect(testPPAPattern('12ab/')).toBe(false);
  });

  it('should return false for strings without a /', () => {
    expect(testPPAPattern('2024')).toBe(false);
    expect(testPPAPattern('1234')).toBe(false);
    expect(testPPAPattern('0001')).toBe(false);
  });

  it('should return false for strings that start with non-digit characters', () => {
    expect(testPPAPattern('a2024/')).toBe(false);
    expect(testPPAPattern('-2024/')).toBe(false);
    expect(testPPAPattern('2024-PPA/')).toBe(false);
  });

  it('should return false for completely different strings', () => {
    expect(testPPAPattern('abcd')).toBe(false);
    expect(testPPAPattern('12ab/cd')).toBe(false);
    expect(testPPAPattern('')).toBe(false);
  });
});
