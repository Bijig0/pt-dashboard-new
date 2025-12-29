import ExcelJS from "exceljs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { cleanWorksheetRows } from "./cleanWorksheetRows/cleanWorksheetRows.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * This script processes all worksheets in the BANK KAS REKAPAN 2025 out.xlsx file
 * and removes:
 * 1. All rows before the "TGL" header
 * 2. All blank rows within the data
 *
 * It processes all month sheets (JAN, FEB, MAR, etc.)
 */

const main = async () => {
  const inFilePath = `${__dirname}/out/BANK KAS REKAPAN 2025 out.xlsx`;
  const outFilePath = `${__dirname}/out/BANK KAS REKAPAN 2025 out-cleaned.xlsx`;

  console.log(`Reading file: ${inFilePath}`);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(inFilePath);

  console.log(`\nFound ${workbook.worksheets.length} worksheets`);

  // Process each worksheet
  workbook.worksheets.forEach((worksheet) => {
    console.log(`\nProcessing worksheet: ${worksheet.name}`);
    console.log(`  Before: ${worksheet.rowCount} rows`);

    // Clean the worksheet using our utility function
    cleanWorksheetRows({ worksheet });

    console.log(`  After: ${worksheet.rowCount} rows`);
    console.log(`  Removed: ${worksheet.rowCount > 0 ? 'blank rows and headers before TGL' : 'N/A'}`);
  });

  // Save the cleaned workbook
  await workbook.xlsx.writeFile(outFilePath);

  console.log(`\n✓ Cleaned file saved to: ${outFilePath}`);
  console.log(`\nSummary:`);
  console.log(`  - All rows before "TGL" header have been removed`);
  console.log(`  - All blank rows within data have been removed`);
  console.log(`  - Each worksheet now starts at row 1 with the TGL header`);
};

// @ts-ignore
if (import.meta.main) {
  main().catch((error) => {
    console.error("Error processing file:", error);
    process.exit(1);
  });
}
