import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";
import { group } from "radash";
import { CompanyName, Tanggal } from "../../types";

const groupAlatRecordsByTanggal = <
  WorksheetRecord extends { tanggal: Tanggal },
>(
  groupedByCompanyName: Record<CompanyName, WorksheetRecord[]>
): Record<CompanyName, { records: Record<Tanggal, WorksheetRecord[]> }> => {
  return pipe(
    groupedByCompanyName,
    R.map((records) => {
      return { records: group(records, ({ tanggal }) => tanggal) };
    })
  ) as Record<CompanyName, { records: Record<Tanggal, WorksheetRecord[]> }>;
};

export default groupAlatRecordsByTanggal;
