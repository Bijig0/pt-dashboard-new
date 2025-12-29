import ExcelJS from "exceljs";

type Params = {
  worksheet: ExcelJS.Worksheet;
};

type Return = ExcelJS.Worksheet;

/**
 * Cleans a worksheet by:
 * 1. Removing all rows before the "TGL" header
 * 2. Removing blank rows within the data
 *
 * This ensures the worksheet starts from row 1 with the "TGL" header
 * and contains no empty rows in between data.
 */
export const cleanWorksheetRows = (params: Params): Return => {
  const { worksheet } = params;

  // First pass: Find the row index where "TGL" appears
  let tglRowIndex: number | null = null;

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (tglRowIndex !== null) return; // Already found TGL

    // Check if any cell in this row contains "TGL"
    const hasTGL = row.values.some((cell) => {
      if (typeof cell === "string") {
        return cell.trim().toUpperCase() === "TGL";
      }
      if (typeof cell === "object" && cell !== null) {
        // Handle rich text or other cell formats
        const cellValue = (cell as any).text || (cell as any).result || "";
        return cellValue.toString().trim().toUpperCase() === "TGL";
      }
      return false;
    });

    if (hasTGL) {
      tglRowIndex = rowNumber;
    }
  });

  // If no TGL found, return worksheet as-is
  if (tglRowIndex === null) {
    return worksheet;
  }

  // Second pass: Collect rows to delete
  const rowsToDelete: number[] = [];

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    // Mark rows before TGL for deletion
    if (rowNumber < tglRowIndex!) {
      rowsToDelete.push(rowNumber);
      return;
    }

    // After TGL row, check for blank rows
    if (rowNumber > tglRowIndex!) {
      const isBlankRow = row.values.every((cell, index) => {
        // Skip the first element (index 0) as row.values is 1-indexed
        if (index === 0) return true;

        if (cell === null || cell === undefined || cell === "") {
          return true;
        }

        if (typeof cell === "string" && cell.trim() === "") {
          return true;
        }

        return false;
      });

      if (isBlankRow) {
        rowsToDelete.push(rowNumber);
      }
    }
  });

  // Delete rows in reverse order to maintain correct indices
  rowsToDelete
    .sort((a, b) => b - a)
    .forEach((rowNumber) => {
      worksheet.spliceRows(rowNumber, 1);
    });

  return worksheet;
};
