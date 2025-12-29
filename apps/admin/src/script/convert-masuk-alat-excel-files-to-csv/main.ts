import ExcelJS from "exceljs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_INPUT_DIR = path.resolve(__dirname, "./excel-input");
const CSV_OUTPUT_DIR = path.resolve(__dirname, "./csv-output");
const PER_SHEET_OUTPUT_DIR = path.resolve(CSV_OUTPUT_DIR, "./per-sheet");

interface SheetResult {
  sheetName: string;
  rows: string[];
}

const getExcelFilesFromDirectory = async (
  dirPath: string
): Promise<string[]> => {
  const files = await readdir(dirPath);
  return files
    .filter((file) => file.endsWith(".xlsx") || file.endsWith(".xls"))
    .map((file) => path.join(dirPath, file));
};

const isJanuaryFirstPattern = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;

  // Handle Date objects
  if (value instanceof Date) {
    return value.getMonth() === 0 && value.getDate() === 1;
  }

  // Handle string patterns like "1-Jan", "1 Jan", "01-Jan", "1-January", etc.
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

  // Handle rich text
  if (typeof cell.value === "object" && "richText" in cell.value) {
    return (cell.value as ExcelJS.CellRichTextValue).richText
      .map((rt) => rt.text)
      .join("");
  }

  // Handle formula results
  if (typeof cell.value === "object" && "result" in cell.value) {
    return (cell.value as ExcelJS.CellFormulaValue).result as
      | string
      | number
      | Date
      | null;
  }

  return cell.value as string | number | Date;
};

const formatCellForCsv = (value: unknown): string => {
  if (value === null || value === undefined) return "";

  // Handle Date objects
  if (value instanceof Date) {
    const day = value.getDate();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[value.getMonth()];
    return `${day}-${month}`;
  }

  const strValue = String(value);

  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (
    strValue.includes(",") ||
    strValue.includes('"') ||
    strValue.includes("\n")
  ) {
    return `"${strValue.replace(/"/g, '""')}"`;
  }

  return strValue;
};

const extractSheetRows = (worksheet: ExcelJS.Worksheet): string[] => {
  const rows: string[] = [];
  let headerRowFound = false;
  let startRowIndex = 1;

  // First pass: find the header row to skip
  worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
    if (headerRowFound) return;

    const col1 = getCellValue(row, 1);
    const col2 = getCellValue(row, 2);
    const col3 = getCellValue(row, 3);
    const col4 = getCellValue(row, 4);

    // Check if this is the "1-Jan STOK PER..." header row
    if (
      isJanuaryFirstPattern(col1) &&
      isStokPerRow(col2) &&
      isEmpty(col3) &&
      isEmpty(col4)
    ) {
      headerRowFound = true;
      startRowIndex = rowNumber + 1; // Start from the next row
    }
  });

  // If no header row found, start from row 1 but skip rows until we find actual data
  if (!headerRowFound) {
    worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      const col1 = getCellValue(row, 1);
      // Look for first row that looks like a date
      if (col1 instanceof Date || /^\d{1,2}[-\s]?\w+/.test(String(col1))) {
        startRowIndex = rowNumber;
        return;
      }
    });
  }

  // Second pass: extract data rows
  worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
    if (rowNumber < startRowIndex) return;

    const col1 = getCellValue(row, 1);
    const col2 = getCellValue(row, 2);
    const col3 = getCellValue(row, 3);
    const col4 = getCellValue(row, 4);

    // Skip completely empty rows
    if (isEmpty(col1) && isEmpty(col2) && isEmpty(col3) && isEmpty(col4)) {
      return;
    }

    // Skip rows that look like headers (STOK PER pattern)
    if (isJanuaryFirstPattern(col1) && isStokPerRow(col2)) {
      return;
    }

    const csvRow = [
      formatCellForCsv(col1),
      formatCellForCsv(col2),
      formatCellForCsv(col3),
      formatCellForCsv(col4),
    ].join(",");

    rows.push(csvRow);
  });

  return rows;
};

const convertExcelToCsv = async (
  filePath: string
): Promise<{ combined: string; sheets: SheetResult[] }> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const allRows: string[] = [];
  const sheetResults: SheetResult[] = [];

  workbook.eachSheet((worksheet: ExcelJS.Worksheet) => {
    const sheetName = worksheet.name;
    const rows = extractSheetRows(worksheet);

    if (rows.length > 0) {
      console.log(`   Sheet "${sheetName}": ${rows.length} rows`);
      allRows.push(...rows);
      sheetResults.push({ sheetName, rows });
    }
  });

  // Build combined CSV with header
  const combinedCsv = ["TGL,Company Name,Masuk,Keluar", ...allRows].join("\n");

  return { combined: combinedCsv, sheets: sheetResults };
};

const sanitizeFileName = (name: string): string => {
  // Replace invalid filename characters with underscores
  return name.replace(/[<>:"/\\|?*]/g, "_").trim();
};

const main = async () => {
  console.log("Starting Excel to CSV conversion...\n");

  try {
    // Ensure output directories exist
    await mkdir(CSV_OUTPUT_DIR, { recursive: true });
    await mkdir(PER_SHEET_OUTPUT_DIR, { recursive: true });
    console.log(`Output directory: ${CSV_OUTPUT_DIR}`);
    console.log(`Per-sheet directory: ${PER_SHEET_OUTPUT_DIR}\n`);

    // Get Excel files
    console.log(`Reading Excel files from ${EXCEL_INPUT_DIR}...`);
    const excelFiles = await getExcelFilesFromDirectory(EXCEL_INPUT_DIR);
    console.log(`   Found ${excelFiles.length} Excel file(s)\n`);

    if (excelFiles.length === 0) {
      console.log(
        "No Excel files found. Please add .xlsx files to the excel-input directory."
      );
      return;
    }

    // Process each file
    for (const filePath of excelFiles) {
      const fileName = path.basename(filePath);
      const baseFileName = path.basename(filePath, path.extname(filePath));
      const combinedCsvFileName = baseFileName + ".csv";
      const combinedCsvFilePath = path.join(CSV_OUTPUT_DIR, combinedCsvFileName);

      console.log(`Processing ${fileName}...`);

      try {
        const { combined, sheets } = await convertExcelToCsv(filePath);

        // Write combined CSV
        await writeFile(combinedCsvFilePath, combined, "utf-8");
        console.log(`   Combined: ${combinedCsvFileName}`);

        // Write per-sheet CSVs
        for (const sheet of sheets) {
          const sheetCsvFileName = `${sanitizeFileName(sheet.sheetName)}.csv`;
          const sheetCsvFilePath = path.join(
            PER_SHEET_OUTPUT_DIR,
            sheetCsvFileName
          );
          const sheetCsv = ["TGL,Company Name,Masuk,Keluar", ...sheet.rows].join("\n");
          await writeFile(sheetCsvFilePath, sheetCsv, "utf-8");
        }
        console.log(`   Per-sheet: ${sheets.length} files written\n`);
      } catch (error) {
        console.log(
          `   Error: ${error instanceof Error ? error.message : String(error)}\n`
        );
      }
    }

    console.log("Conversion complete!");
  } catch (error) {
    console.error(
      "Conversion failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};

main();
