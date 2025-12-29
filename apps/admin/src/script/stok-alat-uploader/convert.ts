/**
 * Stok Alat Converter - Excel to CSV only
 *
 * Converts Excel file(s) to CSV files without uploading to database.
 *
 * Usage:
 *   npx tsx src/script/stok-alat-uploader/convert.ts
 *
 * Prerequisites:
 *   Place your Excel file(s) in the excel-input folder
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getExcelFiles, parseExcelFile, writeCsvFiles } from "./excel-parser";
import type { SheetData } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_INPUT_DIR = path.resolve(__dirname, "./excel-input");
const CSV_OUTPUT_DIR = path.resolve(__dirname, "./csv-output");

const main = async () => {
  console.log("=".repeat(50));
  console.log("  STOK ALAT CONVERTER - Excel to CSV");
  console.log("=".repeat(50));
  console.log();

  try {
    // Step 1: Find Excel files
    console.log(`1. Reading Excel files from ${EXCEL_INPUT_DIR}...`);
    const excelFiles = await getExcelFiles(EXCEL_INPUT_DIR);
    console.log(`   Found ${excelFiles.length} Excel file(s)\n`);

    if (excelFiles.length === 0) {
      console.log("No Excel files found. Please add .xlsx files to the excel-input directory.");
      return;
    }

    // Step 2: Parse Excel files
    console.log("2. Parsing Excel files...");
    const allSheets: SheetData[] = [];

    for (const filePath of excelFiles) {
      const fileName = path.basename(filePath);
      console.log(`\n   Processing ${fileName}...`);

      const { sheets, totalRows } = await parseExcelFile(filePath);
      allSheets.push(...sheets);
      console.log(`   Total: ${totalRows} rows from ${sheets.length} sheets`);
    }

    if (allSheets.length === 0) {
      console.log("\nNo data found in Excel files. Aborting.");
      return;
    }

    // Step 3: Write CSV files
    console.log(`\n3. Writing CSV files to ${CSV_OUTPUT_DIR}...`);
    const csvFiles = await writeCsvFiles(allSheets, CSV_OUTPUT_DIR);
    console.log(`   Written ${csvFiles.length} CSV files`);

    console.log("\n" + "=".repeat(50));
    console.log("  CONVERSION COMPLETE!");
    console.log("=".repeat(50));
    console.log(`   CSV files: ${csvFiles.length}`);
    console.log(`   Output directory: ${CSV_OUTPUT_DIR}`);
    console.log(`\nTo upload these CSVs to the database, run:`);
    console.log(`   npx tsx src/script/stok-alat-uploader/upload.ts [batchId]`);
  } catch (error) {
    console.error(
      "\nConversion failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};

main();
