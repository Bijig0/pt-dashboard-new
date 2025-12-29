import ExcelJS from "exceljs";
import { writeGroupedItemsWorkbook } from "./writeGroupedItemsWorkbook";
import { ProcessedSheetResult } from "./processMultipleSheets";

/**
 * Creates an Excel workbook with multiple sheets, one for each processed result
 *
 * @param results - Array of processed sheet results
 * @returns ExcelJS workbook ready for download
 */
export const createOutputWorkbook = async (
  results: ProcessedSheetResult[]
): Promise<ExcelJS.Workbook> => {
  const outputWorkbook = new ExcelJS.Workbook();

  for (const { sheetName, groupedItems, total } of results) {
    // Create a temporary workbook for this sheet using existing function
    const tempWorkbook = await writeGroupedItemsWorkbook({
      items: groupedItems,
      total,
    });

    // Get the worksheet from temp workbook
    const tempSheet = tempWorkbook.worksheets[0];

    // Create a new worksheet in output workbook with original sheet name
    const newSheet = outputWorkbook.addWorksheet(sheetName);

    // Copy all rows and formatting from temp sheet to new sheet
    tempSheet.eachRow({ includeEmpty: true }, (row, rowNum) => {
      const newRow = newSheet.getRow(rowNum);
      newRow.values = row.values;

      // Copy row formatting
      if (row.font) newRow.font = row.font;
      if (row.fill) newRow.fill = row.fill;
      if (row.border) newRow.border = row.border;

      // Copy cell formatting
      row.eachCell((cell, colNum) => {
        const newCell = newSheet.getCell(rowNum, colNum);
        if (cell.fill) newCell.fill = cell.fill;
        if (cell.border) newCell.border = cell.border;
        if (cell.font) newCell.font = cell.font;
        if (cell.numFmt) newCell.numFmt = cell.numFmt;
      });
    });

    // Copy column widths
    tempSheet.columns.forEach((col, index) => {
      const column = newSheet.getColumn(index + 1);
      if (col.width) column.width = col.width;
    });
  }

  return outputWorkbook;
};
