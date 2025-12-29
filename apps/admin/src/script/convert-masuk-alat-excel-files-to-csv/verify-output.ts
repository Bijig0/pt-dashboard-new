/**
 * Integration test to verify all Excel workbook sheets are present as CSV files.
 * Run with: npx tsx src/script/convert-masuk-alat-excel-files-to-csv/verify-output.ts
 */
import ExcelJS from "exceljs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_INPUT_DIR = path.resolve(__dirname, "./excel-input");
const PER_SHEET_OUTPUT_DIR = path.resolve(__dirname, "./csv-output/per-sheet");

const sanitizeFileName = (name: string): string => {
  return name.replace(/[<>:"/\\|?*]/g, "_").trim();
};

const isJanuaryFirstPattern = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (value instanceof Date) {
    return value.getMonth() === 0 && value.getDate() === 1;
  }
  const strValue = String(value).trim().toLowerCase();
  const jan1Patterns = [
    /^1[-\s]?jan/i,
    /^01[-\s]?jan/i,
    /^1[-\s]?january/i,
    /^01[-\s]?january/i,
    /^jan[-\s]?1$/i,
    /^january[-\s]?1$/i,
  ];
  return jan1Patterns.some((pattern) => pattern.test(strValue));
};

const isStokPerRow = (col2Value: unknown): boolean => {
  if (col2Value === null || col2Value === undefined) return false;
  const strValue = String(col2Value).trim().toUpperCase();
  return strValue.startsWith("STOK PER");
};

const isEmpty = (value: unknown): boolean => {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === "string" && value.trim() === "")
  );
};

const getCellValue = (
  row: ExcelJS.Row,
  colIndex: number
): string | number | Date | null => {
  const cell = row.getCell(colIndex);
  if (cell.value === null || cell.value === undefined) return null;
  if (typeof cell.value === "object" && "richText" in cell.value) {
    return (cell.value as ExcelJS.CellRichTextValue).richText
      .map((rt) => rt.text)
      .join("");
  }
  if (typeof cell.value === "object" && "result" in cell.value) {
    return (cell.value as ExcelJS.CellFormulaValue).result as
      | string
      | number
      | Date
      | null;
  }
  return cell.value as string | number | Date;
};

const countSheetDataRows = (worksheet: ExcelJS.Worksheet): number => {
  let headerRowFound = false;
  let startRowIndex = 1;
  let dataRowCount = 0;

  // First pass: find the header row to skip
  worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
    if (headerRowFound) return;
    const col1 = getCellValue(row, 1);
    const col2 = getCellValue(row, 2);
    const col3 = getCellValue(row, 3);
    const col4 = getCellValue(row, 4);
    if (
      isJanuaryFirstPattern(col1) &&
      isStokPerRow(col2) &&
      isEmpty(col3) &&
      isEmpty(col4)
    ) {
      headerRowFound = true;
      startRowIndex = rowNumber + 1;
    }
  });

  if (!headerRowFound) {
    worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      const col1 = getCellValue(row, 1);
      if (col1 instanceof Date || /^\d{1,2}[-\s]?\w+/.test(String(col1))) {
        startRowIndex = rowNumber;
        return;
      }
    });
  }

  // Second pass: count data rows
  worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
    if (rowNumber < startRowIndex) return;
    const col1 = getCellValue(row, 1);
    const col2 = getCellValue(row, 2);
    const col3 = getCellValue(row, 3);
    const col4 = getCellValue(row, 4);
    if (isEmpty(col1) && isEmpty(col2) && isEmpty(col3) && isEmpty(col4)) {
      return;
    }
    if (isJanuaryFirstPattern(col1) && isStokPerRow(col2)) {
      return;
    }
    dataRowCount++;
  });

  return dataRowCount;
};

const getSheetNamesFromExcel = async (filePath: string): Promise<string[]> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheetNames: string[] = [];
  workbook.eachSheet((worksheet: ExcelJS.Worksheet) => {
    const rowCount = countSheetDataRows(worksheet);
    if (rowCount > 0) {
      sheetNames.push(worksheet.name);
    }
  });

  return sheetNames;
};

const main = async () => {
  console.log("Verifying Excel to CSV conversion output...\n");

  let allPassed = true;

  try {
    // Get Excel files
    const excelFiles = await readdir(EXCEL_INPUT_DIR);
    const xlsxFiles = excelFiles.filter(
      (f) => f.endsWith(".xlsx") || f.endsWith(".xls")
    );

    if (xlsxFiles.length === 0) {
      console.log("No Excel files found in excel-input directory.");
      process.exit(1);
    }

    // Get all sheet names from all Excel files
    const allSheetNames: string[] = [];
    for (const xlsxFile of xlsxFiles) {
      const filePath = path.join(EXCEL_INPUT_DIR, xlsxFile);
      console.log(`Reading Excel file: ${xlsxFile}`);
      const sheetNames = await getSheetNamesFromExcel(filePath);
      console.log(`   Found ${sheetNames.length} sheets with data`);
      allSheetNames.push(...sheetNames);
    }

    // Get all CSV file names from per-sheet output
    const csvFiles = await readdir(PER_SHEET_OUTPUT_DIR);
    const csvFileNames = csvFiles
      .filter((file) => file.endsWith(".csv"))
      .map((file) => path.basename(file, ".csv"));

    console.log(`\nTotal Excel sheets with data: ${allSheetNames.length}`);
    console.log(`Total CSV files in per-sheet: ${csvFileNames.length}`);

    // Sanitize sheet names for comparison
    const sanitizedSheetNames = allSheetNames.map(sanitizeFileName);

    // Check count matches
    if (csvFileNames.length !== sanitizedSheetNames.length) {
      console.log(`\nCOUNT MISMATCH!`);
      allPassed = false;
    } else {
      console.log(`\nCount matches!`);
    }

    // Check all sheet names are present as CSV files
    const missingCsvFiles: string[] = [];
    for (const sheetName of sanitizedSheetNames) {
      if (!csvFileNames.includes(sheetName)) {
        missingCsvFiles.push(sheetName);
      }
    }

    if (missingCsvFiles.length > 0) {
      console.log(`\nMissing CSV files for sheets:`);
      missingCsvFiles.forEach((name) => console.log(`   - ${name}`));
      allPassed = false;
    }

    // Check all CSV files correspond to a sheet
    const extraCsvFiles: string[] = [];
    for (const csvName of csvFileNames) {
      if (!sanitizedSheetNames.includes(csvName)) {
        extraCsvFiles.push(csvName);
      }
    }

    if (extraCsvFiles.length > 0) {
      console.log(`\nExtra CSV files without corresponding sheet:`);
      extraCsvFiles.forEach((name) => console.log(`   - ${name}`));
      allPassed = false;
    }

    if (allPassed) {
      console.log(`\nAll checks passed! Every Excel sheet has a corresponding CSV file.`);
    } else {
      console.log(`\nSome checks failed!`);
      process.exit(1);
    }
  } catch (error) {
    console.error(
      "Verification failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};

main();
