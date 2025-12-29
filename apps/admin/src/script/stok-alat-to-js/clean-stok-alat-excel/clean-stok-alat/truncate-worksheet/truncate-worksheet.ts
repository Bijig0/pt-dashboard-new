import ExcelJS from "exceljs";

export async function truncateWorksheetRows(
  workbook: ExcelJS.Workbook
): Promise<ExcelJS.Workbook> {
  try {
    // Iterate through all worksheets
    workbook.eachSheet((worksheet) => {
      let rowToKeep = 1;

      // Find the first row containing a date in the first column
      for (let row = 1; row <= worksheet.rowCount; row++) {
        const cell = worksheet.getCell(row, 1);
        if (!isNaN(Date.parse(cell.text))) {
          rowToKeep = row;
          break;
        }
      }

      // Remove all rows above the first date row
      if (rowToKeep > 1) {
        worksheet.spliceRows(1, rowToKeep - 2);
        console.log(
          `Removed ${rowToKeep - 1} rows from worksheet "${worksheet.name}".`
        );
      } else {
        console.log(
          `No date found in the first column of worksheet "${worksheet.name}". No rows removed.`
        );
      }
    });

    // Save the modified workbook
    console.log("Workbook processing completed successfully.");
    return workbook;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}
