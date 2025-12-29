import { sortCliInputs } from './sortCliInputs.js';

describe('sortCliInputs', () => {
  it('should sort clusters of string numbers in ascending order', () => {
    const rows = [
      ['003', '001', '002'],
      ['005', '004'],
      ['010', '007', '008'],
    ];

    const expected = [
      ['001', '002', '003'],
      ['004', '005'],
      ['007', '008', '010'],
    ];

    const result = sortCliInputs({ rows });
    expect(result).toEqual(expected);
  });

  it('should handle clusters that are already sorted', () => {
    const rows = [
      ['001', '002', '003'],
      ['004', '005'],
      ['007', '008', '010'],
    ];

    const expected = [
      ['001', '002', '003'],
      ['004', '005'],
      ['007', '008', '010'],
    ];

    const result = sortCliInputs({ rows });
    expect(result).toEqual(expected);
  });

  it('should handle clusters with a single element', () => {
    const rows = [['001'], ['005'], ['010']];

    const expected = [['001'], ['005'], ['010']];

    const result = sortCliInputs({ rows });
    expect(result).toEqual(expected);
  });

  it('should handle an empty list of clusters', () => {
    const rows: string[][] = [];

    const expected: string[][] = [];

    const result = sortCliInputs({ rows });
    expect(result).toEqual(expected);
  });

  it.todo('should handle clusters with empty strings', 
  // @ts-ignore
  () => {
    const rows = [
      ['003', '', '002'],
      ['005', ''],
    ];

    const expected = [
      ['', '002', '003'],
      ['', '005'],
    ];

    const result = sortCliInputs({ rows });
    expect(result).toEqual(expected);
  });

  it('should handle clusters with varying string lengths', () => {
    const rows = [
      ['003', '01', '002'],
      ['10', '2', '5'],
    ];

    const expected = [
      ['01', '002', '003'],
      ['2', '5', '10'],
    ];

    const result = sortCliInputs({ rows });
    expect(result).toEqual(expected);
  });
});
