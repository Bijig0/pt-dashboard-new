import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";
import { CompanyName, Tanggal } from "../../types";

/**
 * Parses a date string in DD/MM/YYYY format to a Date object for comparison
 */
const parseDateString = (dateStr: string): Date => {
  const parts = dateStr.split("/").map(Number);
  const day = parts[0] ?? 1;
  const month = parts[1] ?? 1;
  const year = parts[2] ?? 2000;
  return new Date(year, month - 1, day);
};

/**
 * Sorts records by date ascending within each company.
 * Replaces groupAlatRecordsByTanggal - instead of grouping by date,
 * we keep records as a flat array sorted by date.
 */
const sortRecordsByDate = <WorksheetRecord extends { tanggal: Tanggal }>(
  groupedByCompanyName: Record<CompanyName, WorksheetRecord[]>
): Record<CompanyName, { records: WorksheetRecord[] }> => {
  return pipe(
    groupedByCompanyName,
    R.map((records) => {
      const sortedRecords = [...records].sort((a, b) => {
        const dateA = parseDateString(a.tanggal);
        const dateB = parseDateString(b.tanggal);
        return dateA.getTime() - dateB.getTime();
      });
      return { records: sortedRecords };
    })
  );
};

export default sortRecordsByDate;
