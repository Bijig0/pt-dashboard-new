import { Row } from "#src/script/types.js";
import ExcelJS from "exceljs";

export const recreateWorksheetWithNewRows = (
  rows: Row[],
  worksheet: ExcelJS.Worksheet,
  workbook: ExcelJS.Workbook
) => {
  workbook.removeWorksheet(worksheet.id);
  const newWorksheet = workbook.addWorksheet(worksheet.name);
  newWorksheet.addRows(rows);
};
