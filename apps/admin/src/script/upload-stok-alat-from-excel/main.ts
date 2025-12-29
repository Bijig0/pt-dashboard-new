import ExcelJS from "exceljs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stokAlatToConsumable } from "../stok-alat-to-js/stok-alat-to-js";
import {
  getCompanyNames,
  upsertAlatNames,
  upsertCompanyNames,
  upsertStokAlatRecords,
} from "./database-operations";
import { authenticateSupabase } from "./supabase-client";
import { ProcessResult, SeedingSummary, StokAlat } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_FILES_DIR = path.resolve(
  __dirname,
  "../upload-stok-alat/excel_files"
);

const getExcelWorkbookFromFilePath = async (
  filePath: string
): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  return workbook;
};

const getExcelFilesFromDirectory = async (
  dirPath: string
): Promise<string[]> => {
  const files = await readdir(dirPath);
  return files
    .filter((file) => file.endsWith(".xlsx") || file.endsWith(".xls"))
    .map((file) => path.join(dirPath, file));
};

const processExcelFile = async (
  filePath: string,
  allowedCompanies: string[]
): Promise<ProcessResult> => {
  const fileName = path.basename(filePath);
  const alatName = path.basename(filePath, path.extname(filePath));

  console.log(`4️⃣  Processing ${fileName}...`);

  try {
    const workbook = await getExcelWorkbookFromFilePath(filePath);

    const stokAlatData = await stokAlatToConsumable({
      workbook,
      allowedCompanyNames: allowedCompanies,
      alatName,
    });

    if (!stokAlatData) {
      return {
        fileName,
        alatName,
        success: false,
        errorMessage: "Validation failed - check errors logged above",
      };
    }

    console.log(`   ✅ Validated ${stokAlatData.length} records`);

    return {
      fileName,
      alatName,
      success: true,
      recordCount: stokAlatData.length,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.log(`   ❌ Error processing file: ${errorMessage}`);
    return {
      fileName,
      alatName,
      success: false,
      errorMessage,
    };
  }
};

const seedToDatabase = async (
  filePaths: string[],
  allowedCompanies: string[]
): Promise<{ stokAlatRecords: StokAlat[]; alatNames: string[] }> => {
  const allStokAlatRecords: StokAlat[] = [];
  const allAlatNames: string[] = [];

  for (const filePath of filePaths) {
    const fileName = path.basename(filePath);
    const alatName = path.basename(filePath, path.extname(filePath));

    try {
      const workbook = await getExcelWorkbookFromFilePath(filePath);

      const stokAlatData = await stokAlatToConsumable({
        workbook,
        allowedCompanyNames: allowedCompanies,
        alatName,
      });

      if (stokAlatData) {
        allStokAlatRecords.push(...stokAlatData);
        allAlatNames.push(alatName);
      }
    } catch (error) {
      console.log(`   ⏭️  Skipping ${fileName} due to error`);
    }
  }

  return { stokAlatRecords: allStokAlatRecords, alatNames: allAlatNames };
};

const main = async () => {
  console.log("🌱 Starting Excel to Database seeding...\n");

  try {
    // Step 1: Authenticate
    console.log("1️⃣  Authenticating with Supabase...");
    await authenticateSupabase();
    console.log("   ✅ Authenticated successfully\n");

    // Step 2: Fetch allowed company names
    console.log("2️⃣  Fetching allowed company names from database...");
    const allowedCompanies = await getCompanyNames();
    console.log(`   ✅ Found ${allowedCompanies.length} companies\n`);

    // Step 3: Get Excel files
    console.log(`3️⃣  Reading Excel files from ${EXCEL_FILES_DIR}...`);
    const excelFiles = await getExcelFilesFromDirectory(EXCEL_FILES_DIR);
    console.log(`   ✅ Found ${excelFiles.length} Excel files\n`);

    if (excelFiles.length === 0) {
      console.log(
        "⚠️  No Excel files found. Please add .xlsx files to the excel_files directory."
      );
      return;
    }

    // Step 4: Validate all files first
    const results: ProcessResult[] = [];
    for (const filePath of excelFiles) {
      const result = await processExcelFile(filePath, allowedCompanies);
      results.push(result);
    }

    // Filter successful files
    const successfulFiles = excelFiles.filter((_, index) => {
      const result = results[index];
      if (!result.success) {
        console.log(`⏭️  Skipping ${result.fileName} due to errors\n`);
      }
      return result.success;
    });

    if (successfulFiles.length === 0) {
      console.log("❌ No files passed validation. Aborting database seeding.");
      printSummary({
        totalFiles: excelFiles.length,
        filesProcessed: 0,
        filesWithErrors: results.filter((r) => !r.success).length,
        totalRecords: 0,
        results,
      });
      return;
    }

    // Step 5: Seed to database
    console.log(
      `5️⃣  Seeding validated data from ${successfulFiles.length} files to database...\n`
    );

    const { stokAlatRecords, alatNames } = await seedToDatabase(
      successfulFiles,
      allowedCompanies
    );

    const uniqueCompanies = [
      ...new Set(stokAlatRecords.map((r) => r.company_name)),
    ];

    await upsertCompanyNames(uniqueCompanies);
    await upsertAlatNames(alatNames, uniqueCompanies);
    const recordCount = await upsertStokAlatRecords(stokAlatRecords);

    console.log(`\n✅ Seeded ${recordCount} records to database`);
    console.log("🎉 Seeding complete!\n");

    // Print summary
    printSummary({
      totalFiles: excelFiles.length,
      filesProcessed: successfulFiles.length,
      filesWithErrors: results.filter((r) => !r.success).length,
      totalRecords: recordCount,
      results,
    });
  } catch (error) {
    console.error(
      "💥 Seeding failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};

const printSummary = (summary: SeedingSummary) => {
  console.log("📊 Summary:");
  console.log(`   - Total files: ${summary.totalFiles}`);
  console.log(`   - Files processed: ${summary.filesProcessed}`);
  console.log(`   - Files with errors: ${summary.filesWithErrors}`);
  console.log(`   - Total records inserted: ${summary.totalRecords}`);

  if (summary.filesWithErrors > 0) {
    console.log("\n   Failed files:");
    summary.results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`   - ${r.fileName}: ${r.errorMessage}`);
      });
  }
};

main();
