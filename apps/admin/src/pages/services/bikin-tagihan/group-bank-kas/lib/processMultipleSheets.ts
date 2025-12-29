import ExcelJS from "exceljs";
import { processWorksheet } from "./processWorksheet";
import { ItemsSchema } from "./types";

export type ProcessedSheetResult = {
  sheetName: string;
  groupedItems: ItemsSchema;
  total: number;
};

/**
 * Processes multiple worksheets in batch
 *
 * @param workbook - ExcelJS workbook containing sheets
 * @param sheetNames - Array of sheet names to process
 * @returns Array of processed results, one per sheet
 */
export const processMultipleSheets = async (
  workbook: ExcelJS.Workbook,
  sheetNames: string[]
): Promise<ProcessedSheetResult[]> => {
  const results: ProcessedSheetResult[] = [];

  for (const sheetName of sheetNames) {
    const worksheet = workbook.getWorksheet(sheetName);

    if (!worksheet) {
      throw new Error(`Sheet "${sheetName}" not found in workbook`);
    }

    try {
      const { groupedItems, total } = await processWorksheet(worksheet);

      results.push({
        sheetName,
        groupedItems,
        total,
      });
    } catch (error) {
      // Re-throw with sheet context
      throw new Error(
        `Error processing sheet "${sheetName}": ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  return results;
};
