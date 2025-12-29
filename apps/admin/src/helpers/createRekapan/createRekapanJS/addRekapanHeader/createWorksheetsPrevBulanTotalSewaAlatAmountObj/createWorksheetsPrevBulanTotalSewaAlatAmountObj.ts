import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { identity, pipe } from "fp-ts/lib/function";
import { objectEntries, objectFromEntries } from "ts-extras";
import { RekapanWorkbookObj } from "../../../../../hooks/useGetRekapanData";
import { WorksheetsAlatHeaderObj } from "../createWorkbookCurrentBulanTotalSewaAlatAmountObj/createWorkbookCurrentBulanTotalSewaAlatAmountObj";
import { WorksheetAlatHeaderObj } from "../createWorkbookCurrentBulanTotalSewaAlatAmountObj/createWorksheetCurrentBulanTotalSewaAlatAmountObj/createWorksheetCurrentBulanTotalSewaAlatAmountObj";
import { listWorksheetsAlatNames } from "../listWorksheetsAlatNames/listWorksheetsAlatNames";
import { retrieveRekapanSewaAlatAmount } from "./retrieveRekapanSewaAlatAmount/retrieveRekapanSewaAlatAmount";

export const createWorksheetsPrevBulanTotalSewaAlatAmountObj = (
  currentMonthWorksheetsAlats: ReturnType<typeof listWorksheetsAlatNames>,
  prevMonthRekapan: O.Option<RekapanWorkbookObj>
): WorksheetsAlatHeaderObj<{ prevBulanTotalSewaAlatAmount: number }> => {
  const retrievePrevBulanTotalSewaAlatAmount = pipe(
    prevMonthRekapan,
    O.map(retrieveRekapanSewaAlatAmount)
  );

  const createWorksheetPrevBulanTotalSewaAlatAmountObj = (
    currentMonthWorksheetAlatNames: string[],
    worksheetName: string
  ): WorksheetAlatHeaderObj<{ prevBulanTotalSewaAlatAmount: number }> => {
    return pipe(
      currentMonthWorksheetAlatNames,
      A.map((worksheetAlatName) => {
        const prevBulanTotalSewaAlatAmount = pipe(
          O.Do,
          O.bind("alatName", () => O.of(worksheetAlatName)),
          O.bind(
            "retrievePrevBulanTotalSewaAlatAmount",
            () => retrievePrevBulanTotalSewaAlatAmount
          ),
          O.map(({ alatName, retrievePrevBulanTotalSewaAlatAmount }) => {
            const prevBulanTotalSewaAlatAmount =
              retrievePrevBulanTotalSewaAlatAmount(alatName, worksheetName);
            // if (worksheetName === "ADITYA") {
            // console.log({
            //   alatName,
            //   worksheetName,
            //   prevBulanTotalSewaAlatAmount,
            // });
            // }

            return prevBulanTotalSewaAlatAmount;
          }),
          O.match(() => 0, identity)
        );
        return [worksheetAlatName, { prevBulanTotalSewaAlatAmount }] as const;
      }),
      objectFromEntries
    );
  };

  /*
    This is where it should diverge I think, so if currentMonthWorksheetAlatNames is empty
    then that means that this should be a carry-over.

    It means that we should just use the prevMonthRekapan
  */

  return pipe(
    currentMonthWorksheetsAlats,
    objectEntries,
    A.map(([companyName, currentMonthWorksheetAlatNames]) => {
      const prevBulanTotalSewaAlatAmountObj =
        createWorksheetPrevBulanTotalSewaAlatAmountObj(
          currentMonthWorksheetAlatNames,
          companyName
        );
      return [companyName, prevBulanTotalSewaAlatAmountObj] as const;
    }),
    objectFromEntries
  );
};
