import ExcelJS from "exceljs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ParsedExcelResult, SheetData } from "./types";

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

const formatDateForCsv = (value: unknown): string => {
  if (value === null || value === undefined) return "";

  if (value instanceof Date) {
    const day = value.getDate();
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const month = months[value.getMonth()];
    return `${day}-${month}`;
  }

  return String(value);
};

const formatCellForCsv = (value: unknown): string => {
  if (value === null || value === undefined) return "";

  if (value instanceof Date) {
    return formatDateForCsv(value);
  }

  const strValue = String(value);

  if (
    strValue.includes(",") ||
    strValue.includes('"') ||
    strValue.includes("\n")
  ) {
    return `"${strValue.replace(/"/g, '""')}"`;
  }

  return strValue;
};

const extractSheetData = (worksheet: ExcelJS.Worksheet): SheetData => {
  const rows: SheetData["rows"] = [];
  let headerRowFound = false;
  let startRowIndex = 1;

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

    rows.push({
      tgl: formatDateForCsv(col1),
      companyName: String(col2 ?? "").trim(),
      masuk: String(col3 ?? "").trim(),
      keluar: String(col4 ?? "").trim(),
      lineNumber: rowNumber,
    });
  });

  return {
    sheetName: worksheet.name,
    rows,
  };
};

export const parseExcelFile = async (
  filePath: string
): Promise<ParsedExcelResult> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheets: SheetData[] = [];
  let totalRows = 0;

  workbook.eachSheet((worksheet: ExcelJS.Worksheet) => {
    const sheetData = extractSheetData(worksheet);

    if (sheetData.rows.length > 0) {
      console.log(`   Sheet "${sheetData.sheetName}": ${sheetData.rows.length} rows`);
      sheets.push(sheetData);
      totalRows += sheetData.rows.length;
    }
  });

  return { sheets, totalRows };
};

export const getExcelFiles = async (dirPath: string): Promise<string[]> => {
  const files = await readdir(dirPath);
  return files
    .filter((file) => file.endsWith(".xlsx") || file.endsWith(".xls"))
    .map((file) => path.join(dirPath, file));
};

const sanitizeFileName = (name: string): string => {
  return name.replace(/[<>:"/\\|?*]/g, "_").trim();
};

export const writeCsvFiles = async (
  sheets: SheetData[],
  outputDir: string
): Promise<string[]> => {
  await mkdir(outputDir, { recursive: true });

  const writtenFiles: string[] = [];

  for (const sheet of sheets) {
    const fileName = `${sanitizeFileName(sheet.sheetName)}.csv`;
    const filePath = path.join(outputDir, fileName);

    const csvRows = ["TGL,Company Name,Masuk,Keluar"];
    for (const row of sheet.rows) {
      csvRows.push(
        [
          formatCellForCsv(row.tgl),
          formatCellForCsv(row.companyName),
          formatCellForCsv(row.masuk),
          formatCellForCsv(row.keluar),
        ].join(",")
      );
    }

    await writeFile(filePath, csvRows.join("\n"), "utf-8");
    writtenFiles.push(filePath);
  }

  return writtenFiles;
};
