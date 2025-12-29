import ExcelJS from "exceljs";
import { standardizeDates } from "./standardizeDates/standardizeDates";
import { truncateWorksheetRows } from "./truncate-worksheet/truncate-worksheet";

export const cleanStokAlat = async (
  workbook: ExcelJS.Workbook
): Promise<ExcelJS.Workbook> => {
  const truncatedWorkbook = await truncateWorksheetRows(workbook);
  const standardizedDates = standardizeDates(truncatedWorkbook);
  return standardizedDates;
};
