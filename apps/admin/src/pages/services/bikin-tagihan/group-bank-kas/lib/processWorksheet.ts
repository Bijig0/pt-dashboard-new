import ExcelJS from "exceljs";
import { cleanWorksheetRows } from "./cleanWorksheetRows";
import { createItems } from "./createItems";
import { groupItemsByName } from "./groupItemsByName";
import { sortItemsByName } from "./sortItemsByName";
import { ItemsSchema } from "./types";

const BANK_KAS_CONFIG = {
  itemNameColumn: 1, // KETERANGAN (0-indexed)
  itemPriceColumn: 2, // KELUAR (0-indexed)
};

/**
 * Processes a single worksheet by:
 * 1. Cleaning the worksheet (removing rows before TGL, removing blanks)
 * 2. Determining data range dynamically
 * 3. Extracting items (KETERANGAN, KELUAR)
 * 4. Grouping by name and summing prices
 * 5. Sorting alphabetically
 *
 * @param worksheet - ExcelJS worksheet to process
 * @returns Grouped items and total
 */
export const processWorksheet = async (
  worksheet: ExcelJS.Worksheet
): Promise<{ groupedItems: ItemsSchema; total: number }> => {
  // Step 1: Clean worksheet (removes rows before TGL and blank rows)
  const cleanedWorksheet = cleanWorksheetRows({ worksheet });

  // Step 2: Determine data range dynamically
  const rowCount = cleanedWorksheet.rowCount;

  // If no rows or only header, return empty result
  if (rowCount < 2) {
    throw new Error("No data rows found after TGL header");
  }

  const worksheetInfo = {
    ...BANK_KAS_CONFIG,
    itemsStartRow: 2, // After TGL header (1-indexed)
    itemsEndRow: rowCount,
  };

  // Step 3: Extract items
  const { items, total: initialTotal } = createItems({
    worksheet: cleanedWorksheet,
    worksheetInfo,
  });

  // Step 4: Group by name
  const { items: groupedItems, total } = groupItemsByName({ items });

  // Step 5: Sort alphabetically
  const sortedItems = sortItemsByName(groupedItems);

  return {
    groupedItems: sortedItems,
    total,
  };
};
