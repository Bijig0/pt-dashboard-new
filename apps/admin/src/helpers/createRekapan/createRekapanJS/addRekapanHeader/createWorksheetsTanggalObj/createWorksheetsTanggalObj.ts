import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";
import { objectFromEntries } from "ts-extras";
import { RekapanWorkbookBody } from "../../../types";
import { WorksheetsAlatHeaderObj } from "../createWorkbookCurrentBulanTotalSewaAlatAmountObj/createWorkbookCurrentBulanTotalSewaAlatAmountObj";
import { listWorksheetsAlatNames } from "../listWorksheetsAlatNames/listWorksheetsAlatNames";
import { getRekapanMonth } from "./getRekapanMonth/getRekapanMonth";

// Cuz it's taking all the alat Names from the current month and all the
// Worksheet names from the current month so if
// the current month does not contain that worksheet name/ does not contain that alat name
// Then it gets completely ignored

// Ok but the thing is currentMonthRekapanWorkbookBody should actually now contain
// all the ones
// */

/*
      Optional prevMonthRekapan case occurs when we are at the start beginning month
      creating the rekapan so the optional should always leave a default value. Nice use case for Option here
    */
export const createWorksheetsTanggalObj = (
  currentMonthWorksheetAlatNames: ReturnType<typeof listWorksheetsAlatNames>,
  currentMonthRekapanWorkbookBody: RekapanWorkbookBody,
  providedRekapanMonth?: number
): WorksheetsAlatHeaderObj<{ rekapanMonth: number }> => {
  // Use provided month, or try to extract from records (may fail if no records)
  const rekapanMonth =
    providedRekapanMonth ?? getRekapanMonth(currentMonthRekapanWorkbookBody);

  return pipe(
    currentMonthWorksheetAlatNames,
    R.map((alatNames) => {
      return pipe(
        alatNames,
        A.map((alatName) => [alatName, { rekapanMonth }] as const),
        objectFromEntries
      );
    })
  );
};
