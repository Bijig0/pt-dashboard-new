import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { identity, pipe } from "fp-ts/lib/function";
import { objectEntries, objectFromEntries } from "ts-extras";
import { CompanyName, RekapanWorkbookBody } from "../../../types";
import {
  WorksheetAlatHeaderObj,
  createWorksheetCurrentBulanTotalSewaAlatAmountObj,
} from "./createWorksheetCurrentBulanTotalSewaAlatAmountObj/createWorksheetCurrentBulanTotalSewaAlatAmountObj";

export type WorksheetsAlatHeaderObj<Obj extends Record<PropertyKey, any>> = {
  [x: CompanyName]: WorksheetAlatHeaderObj<Obj> & {};
} & {};

/*

  Returns

  type Return = {
    [k: WorksheetName/CompanyName]: Record<AlatName, {currentBulanSewaAlatAmount: number}>
    
  }
  */
export const createWorkbookCurrentBulanTotalSewaAlatAmountObj = (
  worksheets: RekapanWorkbookBody,
  currentMonthWorksheetsPrevBulanTotalSewaAlatAmountObj: WorksheetsAlatHeaderObj<{
    prevBulanTotalSewaAlatAmount: number;
  }>
): WorksheetsAlatHeaderObj<{
  currentBulanTotalSewaAlatAmount: number;
}> => {
  return pipe(
    worksheets,
    objectEntries,
    A.map(([companyName, worksheet]) => {
      const specificCompanyCurrentMonthWorksheetsPrevBulanTotalSewaAlatAmountObj =
        pipe(
          currentMonthWorksheetsPrevBulanTotalSewaAlatAmountObj[companyName],
          E.fromNullable(new Error("No prevBulanTotalSewaAlatAmount"))
        );
      return pipe(
        specificCompanyCurrentMonthWorksheetsPrevBulanTotalSewaAlatAmountObj,
        E.map((prevBulanTotalSewaAlatAmountObj) => {
          const x = createWorksheetCurrentBulanTotalSewaAlatAmountObj(
            worksheet,
            prevBulanTotalSewaAlatAmountObj
          );
          
          console.log({
            x,
            worksheet,
            prevBulanTotalSewaAlatAmountObj,
          });
          return x;
        }),
        E.match((error) => {
          throw error;
        }, identity),
        (currentBulanTotalSewaAlatAmountObj) =>
          [companyName, currentBulanTotalSewaAlatAmountObj] as const
      );
    }),
    objectFromEntries
  );
};
