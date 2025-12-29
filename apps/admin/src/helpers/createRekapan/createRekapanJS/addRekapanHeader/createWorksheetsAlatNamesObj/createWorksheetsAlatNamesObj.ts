import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/function";
import { objectFromEntries } from "ts-extras";
import { AlatName } from "../../../types";
import { WorksheetsAlatHeaderObj } from "../createWorkbookCurrentBulanTotalSewaAlatAmountObj/createWorkbookCurrentBulanTotalSewaAlatAmountObj";
import { listWorksheetsAlatNames } from "../listWorksheetsAlatNames/listWorksheetsAlatNames";

export const createWorksheetsAlatNamesObj = (
  currentMonthWorksheetAlatNames: ReturnType<typeof listWorksheetsAlatNames>
): WorksheetsAlatHeaderObj<{ alatName: AlatName }> => {
  return pipe(
    currentMonthWorksheetAlatNames,
    R.map((alatNames) => {
      return pipe(
        alatNames,
        A.map((alatName) => [alatName, { alatName }] as const),
        objectFromEntries
      );
    })
  );
};
