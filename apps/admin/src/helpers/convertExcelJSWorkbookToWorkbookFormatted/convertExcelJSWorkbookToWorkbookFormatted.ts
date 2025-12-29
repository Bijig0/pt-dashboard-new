import * as ExcelJS from "exceljs";
import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { objectFromEntries } from "tsafe";
import { convertExcelWorksheetToArrays } from "../../hooks/useGetRekapanData";
import { convertTagihanJSToWorkbook } from "../createTagihan/convertTagihanJSToWorkbook/convertTagihanJSToWorkbook";
import { CleanedWorksheetSchema } from "../excel-types";

export type WorksheetName = string & {};

export const convertExcelJSWorkbookToWorkbookFormatted = async (
  workbook: ExcelJS.Workbook
): Promise<Record<WorksheetName, CleanedWorksheetSchema>> => {
  const worksheets = workbook.worksheets;

  const entries = worksheets.map(
    (worksheet) => [worksheet.name as WorksheetName, worksheet] as const
  );

  const rekapanArrays = entries.map(([name, worksheet]) => {
    return [name, convertExcelWorksheetToArrays(worksheet)] as const;
  });

  const errorsProcessed = pipe(
    rekapanArrays,
    A.map(([name, either]) => {
      return pipe(
        either,
        E.match(
          (error) => {
            throw error;
          },
          (worksheetRows) => {
            return [name, worksheetRows] as const;
          }
        )
      );
    })
  );

  const asObject = objectFromEntries(errorsProcessed);

  return asObject;
};

// @ts-ignore
if (import.meta.main) {
  // const wb = convertTagihanJSToWorkbook(mockData);

  // const result = convertExcelJSWorkbookToWorkbookFormatted(wb);

  // console.log({ result });
}
