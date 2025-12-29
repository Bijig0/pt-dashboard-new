import ExcelJS, { Workbook, Worksheet } from "exceljs";
import * as A from "fp-ts/Array";
import { IO } from "fp-ts/IO";
import { pipe } from "fp-ts/lib/function";
import { objectEntries } from "ts-extras";
import cleanWorksheetName from "../../cleanWorksheetName/cleanWorksheetName";
import { createUniqueWorksheetNameGenerator } from "../getUniqueWorksheetName/getUniqueWorksheetName";
import { mergeRecordsByDate } from "../mergeRecordsByDate/mergeRecordsByDate";
import { RekapanWorkbook } from "../types";
import {
  createAndAddWorksheet,
  writeCurrentBulanTotalSewaAlatAmount,
  writeHeaderNames,
  writePrevBulanTotalSewaAlatAmount,
  writeRow,
} from "../write-to-excel-fns/write-to-excel-fns";

export const convertRekapanJSToRekapanWorkbook = (
  rekapanJS: RekapanWorkbook
): Workbook => {
  const createWorkbook: IO<Workbook> = () => new ExcelJS.Workbook();

  const getUniqueWorksheetName = createUniqueWorksheetNameGenerator();

  const writeToWorkbook = (workbook: Workbook): void => {
    pipe(
      rekapanJS,
      objectEntries,
      A.map(([companyName, rekapanWorksheet]) => {
        const cleanedName = pipe(companyName, cleanWorksheetName);
        const worksheetName = getUniqueWorksheetName(cleanedName);

        const logSheetValuesAndReturn = (ws: Worksheet) => {
          console.log({ ws: ws.getSheetValues() });
          return ws;
        };

        const writeRekapanWorksheetToWorkbook: IO<Worksheet> = () => {
          return pipe(
            workbook,
            (wb) => createAndAddWorksheet(wb, worksheetName),
            (ws) => writeHeaderNames(rekapanWorksheet.header, ws),
            (ws) =>
              writePrevBulanTotalSewaAlatAmount(rekapanWorksheet.header, ws),
            (ws) => {
              const mergedRows = mergeRecordsByDate(rekapanWorksheet.records);
              mergedRows.forEach((row) => {
                writeRow(row, ws);
              });
              return ws;
            },
            (ws) =>
              writeCurrentBulanTotalSewaAlatAmount(rekapanWorksheet.header, ws)
            // logSheetValuesAndReturn
          );
        };

        return writeRekapanWorksheetToWorkbook();
      })
    );
  };

  const workbook = createWorkbook();

  writeToWorkbook(workbook);

  return workbook;
};
