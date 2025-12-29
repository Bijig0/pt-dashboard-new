import { DataTagihanSchema } from '../schema/schema.js';
import { collectGroupedRows } from './collectGroupedRows.js';

describe('collectGroupedRows', () => {
  it('should collect rows based on matching numbers after trimming leading zeros', async () => {
    const workbookRows: DataTagihanSchema = [
      ['001', '01234/PPA-I/24', 'Some Data'],
      ['002', '05678/PPA-I/24', 'Other Data'],
      ['003', '00012/PPA-I/24', 'More Data'],
    ];

    const rowsToCollect = [['1234', '5678'], ['12']];

    const result = await collectGroupedRows({ workbookRows, rowsToCollect });

    expect(result).toEqual([
      [
        ['001', '01234/PPA-I/24', 'Some Data'],
        ['002', '05678/PPA-I/24', 'Other Data'],
      ],
      [['003', '00012/PPA-I/24', 'More Data']],
    ]);
  });

  it('should maintain the order of matching rows as specified in rowsToCollect', async () => {
    const workbookRows: DataTagihanSchema = [
      ['001', '01234/PPA-I/24', 'Some Data'],
      ['002', '05678/PPA-I/24', 'Other Data'],
      ['003', '00012/PPA-I/24', 'More Data'],
    ];

    const rowsToCollect = [['5678', '1234']];

    const result = await collectGroupedRows({ workbookRows, rowsToCollect });

    expect(result).toEqual([
      [
        ['002', '05678/PPA-I/24', 'Other Data'],
        ['001', '01234/PPA-I/24', 'Some Data'],
      ],
    ]);
  });

  it('should throw an error if there is a no-match for any row in rowsToCollect', async () => {
    const workbookRows: DataTagihanSchema = [
      ['001', '01234/PPA-I/24', 'Some Data'],
      ['002', '05678/PPA-I/24', 'Other Data'],
      ['003', '00012/PPA-I/24', 'More Data'],
    ];

    const rowsToCollect = [['1234', '9999']]; // 9999 does not match anything

    await expect(
      collectGroupedRows({ workbookRows, rowsToCollect }),
    ).rejects.toThrowError('No match found for 9999');
  });

  it('should throw an error if no rows match for any group', async () => {
    const workbookRows: DataTagihanSchema = [
      ['001', '01234/PPA-I/24', 'Some Data'],
      ['002', '05678/PPA-I/24', 'Other Data'],
      ['003', '00012/PPA-I/24', 'More Data'],
    ];

    const rowsToCollect = [['1234'], ['9999']]; // 9999 does not match anything

    await expect(
      collectGroupedRows({ workbookRows, rowsToCollect }),
    ).rejects.toThrowError('No match found for 9999');
  });
});
