/**
 * Stok Alat Uploader - Full Pipeline
 *
 * Converts Excel file to CSV and uploads to database in one step.
 *
 * Usage:
 *   npx tsx src/script/stok-alat-uploader/main.ts [batchId]
 *
 * Example:
 *   npx tsx src/script/stok-alat-uploader/main.ts stokalat2025
 *
 * Prerequisites:
 *   1. Place your Excel file(s) in the excel-input folder
 *   2. Ensure Supabase credentials are configured
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getExcelFiles,
  parseExcelFile,
  writeCsvFiles,
} from "./excel-parser";
import {
  insertStokAlatRecords,
  upsertCompanyNames,
} from "./database-operations";
import {
  authenticateSupabase,
  initSupabase,
  parseEnvironment,
  getEnvLabel,
  type Environment,
} from "./supabase-client";
import type { SheetData, StokAlatRecordWithSource, ValidationError } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_INPUT_DIR = path.resolve(__dirname, "./excel-input");
const CSV_OUTPUT_DIR = path.resolve(__dirname, "./csv-output");
const DEFAULT_BATCH_ID = "stokalat2025";

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

const parseDateString = (dateStr: string): string => {
  const match = dateStr.match(/^(\d{1,2})-(\w{3})$/i);
  if (!match) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  const day = match[1].padStart(2, "0");
  const monthStr = match[2].toLowerCase();
  const month = MONTHS[monthStr];

  if (!month) {
    throw new Error(`Invalid month: ${monthStr}`);
  }

  return `2025-${month}-${day}`;
};

const convertSheetsToRecords = (
  sheets: SheetData[],
  batchId: string
): { records: StokAlatRecordWithSource[]; companies: Set<string> } => {
  const records: StokAlatRecordWithSource[] = [];
  const companies = new Set<string>();

  for (const sheet of sheets) {
    const alatName = sheet.sheetName;

    for (const row of sheet.rows) {
      if (!row.tgl || !row.companyName) continue;

      try {
        const tanggal = parseDateString(row.tgl);
        const masuk = row.masuk ? parseInt(row.masuk, 10) : null;
        const keluar = row.keluar ? parseInt(row.keluar, 10) : null;

        if (masuk === null && keluar === null) continue;

        companies.add(row.companyName);

        records.push({
          alat_name: alatName,
          company_name: row.companyName,
          tanggal,
          masuk: isNaN(masuk as number) ? null : masuk,
          keluar: isNaN(keluar as number) ? null : keluar,
          upload_batch_id: batchId,
          _sourceFile: `${alatName}.csv`,
          _sourceLine: row.lineNumber,
        });
      } catch (error) {
        console.log(
          `   Warning: Skipping invalid row in ${alatName} line ${row.lineNumber}: ${row.tgl}`
        );
      }
    }
  }

  return { records, companies };
};

const validateRecords = (
  records: StokAlatRecordWithSource[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  for (const record of records) {
    if (
      record.masuk !== null &&
      record.masuk !== 0 &&
      record.keluar !== null &&
      record.keluar !== 0
    ) {
      errors.push({
        type: "MASUK_KELUAR_BOTH_NONZERO",
        record,
        message: `Both masuk (${record.masuk}) and keluar (${record.keluar}) are non-zero`,
      });
    }
  }

  return errors;
};

const printValidationErrors = (errors: ValidationError[]): void => {
  console.error(`\n   ========================================`);
  console.error(`   VALIDATION ERRORS: ${errors.length} issue(s) found`);
  console.error(`   ========================================\n`);

  const errorsByFile = new Map<string, ValidationError[]>();
  for (const error of errors) {
    const file = error.record._sourceFile;
    if (!errorsByFile.has(file)) {
      errorsByFile.set(file, []);
    }
    errorsByFile.get(file)!.push(error);
  }

  for (const [file, fileErrors] of errorsByFile) {
    console.error(`   File: ${file}`);
    console.error(`   ${"─".repeat(40)}`);
    for (const error of fileErrors) {
      const r = error.record;
      console.error(`   Line ${r._sourceLine}: ${error.message}`);
      console.error(`      company: ${r.company_name}, tanggal: ${r.tanggal}`);
    }
    console.error("");
  }
};

const parseBatchId = (args: string[]): string => {
  const nonFlagArgs = args.filter((arg) => !arg.startsWith("--"));
  return nonFlagArgs[0] || DEFAULT_BATCH_ID;
};

const main = async () => {
  const args = process.argv.slice(2);
  const env = parseEnvironment(args);
  const batchId = parseBatchId(args);

  initSupabase(env);

  console.log("=".repeat(50));
  console.log("  STOK ALAT UPLOADER - Full Pipeline");
  console.log("=".repeat(50));
  console.log(`\nEnvironment: ${getEnvLabel(env)}`);
  console.log(`Batch ID: ${batchId}\n`);

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

    // Step 3: Write CSV files (for reference/debugging)
    console.log(`\n3. Writing CSV files to ${CSV_OUTPUT_DIR}...`);
    const csvFiles = await writeCsvFiles(allSheets, CSV_OUTPUT_DIR);
    console.log(`   Written ${csvFiles.length} CSV files`);

    // Step 4: Convert to database records
    console.log("\n4. Converting to database records...");
    const { records, companies } = convertSheetsToRecords(allSheets, batchId);
    console.log(`   Total records: ${records.length}`);
    console.log(`   Unique companies: ${companies.size}`);

    if (records.length === 0) {
      console.log("\nNo valid records to insert. Aborting.");
      return;
    }

    // Step 5: Validate records
    console.log("\n5. Validating records...");
    const validationErrors = validateRecords(records);

    if (validationErrors.length > 0) {
      printValidationErrors(validationErrors);
      throw new Error(
        `Found ${validationErrors.length} invalid record(s). Please fix the source Excel file and re-run.`
      );
    }
    console.log("   All records valid!");

    // Step 6: Authenticate with Supabase
    console.log("\n6. Authenticating with Supabase...");
    await authenticateSupabase();
    console.log("   Authenticated successfully");

    // Step 7: Upsert companies
    console.log("\n7. Upserting companies...");
    await upsertCompanyNames(Array.from(companies));

    // Step 8: Insert records
    console.log("\n8. Inserting records into database...");
    const insertedCount = await insertStokAlatRecords(records);

    console.log("\n" + "=".repeat(50));
    console.log("  UPLOAD COMPLETE!");
    console.log("=".repeat(50));
    console.log(`   Batch ID: ${batchId}`);
    console.log(`   Records inserted: ${insertedCount}`);
    console.log(`   Sheets processed: ${allSheets.length}`);
    console.log(`\nTo rollback this upload, run:`);
    console.log(`   npx tsx src/script/stok-alat-uploader/rollback.ts ${batchId}`);
  } catch (error) {
    console.error(
      "\nUpload failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};

main();
