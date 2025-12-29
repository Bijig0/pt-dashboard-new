import { DataTagihanSchema } from '../schema/schema.js';
import { filterMainDataTagihan } from './filterMainDataTagihan.js';

describe('filterMainDataTagihan', () => {
  it('should filter out rows based on the second element', () => {
    const mainDataTagihan: DataTagihanSchema = [
      ['001', '2024/PPA-I/24', 'Some Data'],
      ['002', '2023/PPA-I/24', 'Other Data'],
      ['003', '2025/PPA-I/24', 'More Data'],
      ['004', '2026/PPA-I/24', 'Extra Data'],
    ];

    const rowsToFilter = [
      [['001', '2024/PPA-I/24']],
      [['003', '2025/PPA-I/24']],
    ];

    const filteredData = filterMainDataTagihan({
      mainDataTagihan,
      rowsToFilter,
    });
    const expected = [
      ['002', '2023/PPA-I/24', 'Other Data'],
      ['004', '2026/PPA-I/24', 'Extra Data'],
    ];

    expect(filteredData).toEqual(expected);
  });

  it('should return the same data when no rows match', () => {
    const mainDataTagihan: DataTagihanSchema = [
      ['001', '2024/PPA-I/24', 'Some Data'],
      ['002', '2023/PPA-I/24', 'Other Data'],
      ['003', '2025/PPA-I/24', 'More Data'],
    ];

    const rowsToFilter = [[['004', '2026/PPA-I/24']]];

    const filteredData = filterMainDataTagihan({
      mainDataTagihan,
      rowsToFilter,
    });
    expect(filteredData).toEqual(mainDataTagihan);
  });

  it('should return an empty array when all rows are filtered out', () => {
    const mainDataTagihan: DataTagihanSchema = [
      ['001', '2024/PPA-I/24', 'Some Data'],
      ['002', '2023/PPA-I/24', 'Other Data'],
      ['003', '2025/PPA-I/24', 'More Data'],
    ];

    const rowsToFilter = [
      [['001', '2024/PPA-I/24']],
      [['002', '2023/PPA-I/24']],
      [['003', '2025/PPA-I/24']],
    ];

    const filteredData = filterMainDataTagihan({
      mainDataTagihan,
      rowsToFilter,
    });
    expect(filteredData).toEqual([]);
  });

  it('should handle rowsToFilter with nested arrays of varying lengths', () => {
    const mainDataTagihan: DataTagihanSchema = [
      ['001', '2024/PPA-I/24', 'Some Data'],
      ['002', '2023/PPA-I/24', 'Other Data'],
      ['003', '2025/PPA-I/24', 'More Data'],
    ];

    const rowsToFilter = [
      [['001', '2024/PPA-I/24']],
      [['003', '2025/PPA-I/24']],
      [
        ['004', '2026/PPA-I/24'],
        ['005', '2027/PPA-I/24'],
      ],
    ];

    const filteredData = filterMainDataTagihan({
      mainDataTagihan,
      rowsToFilter,
    });
    const expected = [['002', '2023/PPA-I/24', 'Other Data']];

    expect(filteredData).toEqual(expected);
  });
});
