import { pipe } from "fp-ts/lib/function";
import { objectFromEntries } from "ts-extras";
import { listWorksheetsAlatNames } from "../../listWorksheetsAlatNames/listWorksheetsAlatNames";
import { WorksheetsAlatHeaderObj } from "../createWorkbookCurrentBulanTotalSewaAlatAmountObj";
import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";

export const createWorksheetsAlatColIndexObj = (
  currentMonthWorksheetsAlats: ReturnType<typeof listWorksheetsAlatNames>
): WorksheetsAlatHeaderObj<{ colIndex: number }> => {
  return pipe(
    currentMonthWorksheetsAlats,
    R.map((alatNames) => {
      return pipe(
        alatNames,
        A.mapWithIndex(
          (colIndex, alatName) => [alatName, { colIndex }] as const
        ),
        objectFromEntries
      );
    })
  );
};
