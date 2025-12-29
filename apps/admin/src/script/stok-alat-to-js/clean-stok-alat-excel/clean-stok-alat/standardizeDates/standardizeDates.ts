import { cleanExcelJSRows } from "#src/script/cleanExcelJSRows.js";
import { getRows } from "#src/script/getRows.js";
import { recreateWorksheetWithNewRows } from "#src/script/recreate-worksheet-with-new-rows/recreate-worksheet-with-new-rows.js";
import ExcelJS from "exceljs";
import { standardizeDatesRows } from "./standardizeDatesRows/standardizeDatesRows";

export function standardizeDates(workbook: ExcelJS.Workbook): ExcelJS.Workbook {
  workbook.eachSheet((worksheet, index) => {
    // Find the TGL column

    // if (worksheet.name !== 'IBU LALA(DUTA PERMAI)') return;

    const worksheetRows = getRows(worksheet);

    const cleanedExcelJSRows = cleanExcelJSRows(worksheetRows);

    console.log({ cleanedExcelJSRows });

    const standardizedRows = standardizeDatesRows(cleanedExcelJSRows);

    console.log({ standardizedRows });

    recreateWorksheetWithNewRows(standardizedRows, worksheet, workbook);
  });

  return workbook;
}
