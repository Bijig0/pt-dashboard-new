import { AlatName } from "../types";

type WorksheetRecord = {
  tanggal: string;
  alatName: AlatName;
  stokDifference: number | null;
};

type MergedRow = {
  Tanggal: string;
  [alatName: AlatName]: number | null | string;
};

/**
 * Merges records into rows by date, creating new rows only on column collision.
 *
 * Algorithm:
 * 1. For each record, find first row with matching date where alat column is empty
 * 2. If found, fill cell
 * 3. If not found, create new row
 *
 * Example:
 * Input:
 *   [{ tanggal: "01/12", alatName: "Alat1", stokDifference: 5 },
 *    { tanggal: "01/12", alatName: "Alat1", stokDifference: 3 },
 *    { tanggal: "01/12", alatName: "Alat2", stokDifference: 7 }]
 *
 * Output:
 *   [{ Tanggal: "01/12", Alat1: 5, Alat2: 7 },  // Records 1 & 3 merged
 *    { Tanggal: "01/12", Alat1: 3 }]            // Record 2 in new row (collision)
 */
export const mergeRecordsByDate = <
  T extends WorksheetRecord,
>(
  records: T[]
): MergedRow[] => {
  const rows: MergedRow[] = [];

  for (const record of records) {
    // Normalize date string by trimming whitespace
    const normalizedTanggal = record.tanggal.trim();

    // Find existing row for this date with empty alat column
    const existingRow = rows.find(
      (row) =>
        row.Tanggal.trim() === normalizedTanggal &&
        row[record.alatName] === undefined
    );

    if (existingRow) {
      // Fill in the empty cell
      existingRow[record.alatName] = record.stokDifference;
    } else {
      // Create new row
      rows.push({
        Tanggal: normalizedTanggal,
        [record.alatName]: record.stokDifference,
      });
    }
  }

  return rows;
};
