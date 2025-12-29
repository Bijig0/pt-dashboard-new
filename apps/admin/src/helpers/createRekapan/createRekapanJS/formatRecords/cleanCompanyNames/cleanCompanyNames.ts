import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import cleanWorksheetName from "../../../../cleanWorksheetName/cleanWorksheetName";

export const cleanCompanyNames = <
  WorksheetRecord extends {
    companyName: string;
  },
>(
  records: WorksheetRecord[]
): WorksheetRecord[] =>
  pipe(
    records,
    A.map((record) => {
      return {
        ...record,
        companyName: cleanWorksheetName(record.companyName),
      };
    })
  );
