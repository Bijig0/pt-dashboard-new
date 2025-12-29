/**
 * Upload Stok Alat from CSV files to database
 *
 * Usage:
 *   npx tsx src/script/upload-stok-alat-from-csv/main.ts [batchId]
 *
 * Example:
 *   npx tsx src/script/upload-stok-alat-from-csv/main.ts stokalat2025
 *
 * Prerequisites:
 *   1. Run the migration.sql in Supabase to add upload_batch_id column
 *   2. Run convert-masuk-alat-excel-files-to-csv to generate CSV files
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  insertStokAlatRecords,
  upsertCompanyNames,
} from "./database-operations";
import { authenticateSupabase } from "./supabase-client";
import type { StokAlatRecordWithSource } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_INPUT_DIR = path.resolve(
  __dirname,
  "../convert-masuk-alat-excel-files-to-csv/csv-output/per-sheet"
);

const DEFAULT_BATCH_ID = "stokalat2025";

const parseDateString = (dateStr: string): string => {
  // Parse date strings like "2-Jan", "15-Feb", etc.
  const months: Record<string, string> = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };

  const match = dateStr.match(/^(\d{1,2})-(\w{3})$/i);
  if (!match) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  const day = match[1].padStart(2, "0");
  const monthStr = match[2].toLowerCase();
  const month = months[monthStr];

  if (!month) {
    throw new Error(`Invalid month: ${monthStr}`);
  }

  // Assume year 2025 based on batch ID context
  return `2025-${month}-${day}`;
};

const parseCsvLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
};

const parseCsvFile = async (
  filePath: string,
  alatName: string,
  batchId: string
): Promise<{ records: StokAlatRecordWithSource[]; companies: Set<string> }> => {
  const content = await readFile(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim());
  const fileName = path.basename(filePath);

  const records: StokAlatRecordWithSource[] = [];
  const companies = new Set<string>();

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (values.length < 4) continue;

    const [tgl, companyName, masukStr, keluarStr] = values;

    if (!tgl || !companyName) continue;

    try {
      const tanggal = parseDateString(tgl);
      const masuk = masukStr ? parseInt(masukStr, 10) : null;
      const keluar = keluarStr ? parseInt(keluarStr, 10) : null;

      if (masuk === null && keluar === null) continue;

      companies.add(companyName);

      records.push({
        alat_name: alatName,
        company_name: companyName,
        tanggal,
        masuk: isNaN(masuk as number) ? null : masuk,
        keluar: isNaN(keluar as number) ? null : keluar,
        upload_batch_id: batchId,
        _sourceFile: fileName,
        _sourceLine: i + 1, // +1 because line numbers are 1-indexed for users
      });
    } catch (error) {
      console.log(
        `   Warning: Skipping invalid row in ${alatName}: ${lines[i]}`
      );
    }
  }

  return { records, companies };
};

const getCsvFiles = async (dirPath: string): Promise<string[]> => {
  const files = await readdir(dirPath);
  return files
    .filter((file) => file.endsWith(".csv"))
    .map((file) => path.join(dirPath, file));
};

const main = async () => {
  const batchId = process.argv[2] || DEFAULT_BATCH_ID;

  console.log("Starting CSV to Database upload...\n");
  console.log(`Batch ID: ${batchId}\n`);

  try {
    // Step 1: Authenticate
    console.log("1. Authenticating with Supabase...");
    await authenticateSupabase();
    console.log("   Authenticated successfully\n");

    // Step 2: Get CSV files
    console.log(`2. Reading CSV files from ${CSV_INPUT_DIR}...`);
    const csvFiles = await getCsvFiles(CSV_INPUT_DIR);
    console.log(`   Found ${csvFiles.length} CSV files\n`);

    if (csvFiles.length === 0) {
      console.log(
        "No CSV files found. Run convert-masuk-alat-excel-files-to-csv first."
      );
      return;
    }

    // Step 3: Parse all CSV files
    console.log("3. Parsing CSV files...");
    const allRecords: StokAlatRecordWithSource[] = [];
    const allCompanies = new Set<string>();

    for (const filePath of csvFiles) {
      const fileName = path.basename(filePath);
      const alatName = path.basename(filePath, ".csv");

      const { records, companies } = await parseCsvFile(
        filePath,
        alatName,
        batchId
      );

      for (const company of Array.from(companies)) {
        allCompanies.add(company);
      }

      allRecords.push(...records);

      if (records.length > 0) {
        console.log(`   ${fileName}: ${records.length} records`);
      }
    }

    console.log(`\n   Total records to insert: ${allRecords.length}`);
    console.log(`   Unique companies: ${allCompanies.size}`);

    if (allRecords.length === 0) {
      console.log("\nNo valid records to insert. Aborting.");
      return;
    }

    // Pre-validation: Collect all validation errors
    const validationErrors: Array<{
      type: string;
      record: StokAlatRecordWithSource;
      message: string;
    }> = [];

    // Check for records with both masuk and keluar non-zero
    for (const record of allRecords) {
      if (record.masuk !== null && record.masuk !== 0 && record.keluar !== null && record.keluar !== 0) {
        validationErrors.push({
          type: "MASUK_KELUAR_BOTH_NONZERO",
          record,
          message: `Both masuk (${record.masuk}) and keluar (${record.keluar}) are non-zero`,
        });
      }
    }

    if (validationErrors.length > 0) {
      console.error(`\n   ========================================`);
      console.error(`   VALIDATION ERRORS: ${validationErrors.length} issue(s) found`);
      console.error(`   ========================================\n`);

      // Group errors by file for easier fixing
      const errorsByFile = new Map<string, typeof validationErrors>();
      for (const error of validationErrors) {
        const file = error.record._sourceFile;
        if (!errorsByFile.has(file)) {
          errorsByFile.set(file, []);
        }
        errorsByFile.get(file)!.push(error);
      }

      for (const [file, errors] of errorsByFile) {
        console.error(`   File: ${file}`);
        console.error(`   ${"─".repeat(40)}`);
        for (const error of errors) {
          const r = error.record;
          console.error(`   Line ${r._sourceLine}: ${error.message}`);
          console.error(`      company: ${r.company_name}, tanggal: ${r.tanggal}`);
        }
        console.error("");
      }

      throw new Error(`Found ${validationErrors.length} invalid record(s). Please fix the source CSV files and re-run.`);
    }

    // Step 4: Upsert all companies first
    console.log("\n4. Upserting companies...");
    const uniqueCompanies = Array.from(allCompanies);
    await upsertCompanyNames(uniqueCompanies);

    // Step 5: Insert records
    console.log("\n5. Inserting records into database...");
    const insertedCount = await insertStokAlatRecords(allRecords);

    console.log(`\nUpload complete!`);
    console.log(`   Batch ID: ${batchId}`);
    console.log(`   Records inserted: ${insertedCount}`);
    console.log(`   Files processed: ${csvFiles.length}`);
    console.log(`\nTo rollback this upload, run:`);
    console.log(
      `   npx tsx src/script/upload-stok-alat-from-csv/rollback.ts ${batchId}`
    );
  } catch (error) {
    console.error(
      "\nUpload failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};

main();
