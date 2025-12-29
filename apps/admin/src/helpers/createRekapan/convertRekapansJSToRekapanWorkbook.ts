import dayjs from "dayjs";
import deepEqual from "deep-equal";
import { Borders, Column, Fill, Workbook, Worksheet } from "exceljs";
import * as A from "fp-ts/Array";
import { IO } from "fp-ts/lib/IO";
import { fromCompare } from "fp-ts/lib/Ord";
import { pipe } from "fp-ts/lib/function";
import { objectEntries } from "ts-extras";
import cleanWorksheetName from "../cleanWorksheetName/cleanWorksheetName";
import { mergeRecordsByDate } from "./mergeRecordsByDate/mergeRecordsByDate";
import { AlatName, RekapanWorkbook } from "./types";
import {
  createWorkbook,
  getOrCreateAndAddWorksheet,
  writeCurrentBulanTotalSewaAlatAmount,
  writeHeaderNames,
  writePrevBulanTotalSewaAlatAmount,
  writeRow,
} from "./write-to-excel-fns/write-to-excel-fns";

export type RekapanDate = string & {};

// Styling constants
const HEADER_ROWS_COUNT = 5;
const TAN_FILL: Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF5DEB3" }, // Tan/wheat color
};
const THIN_BORDER: Partial<Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};
const MEDIUM_BORDER: Partial<Borders> = {
  top: { style: "medium" },
  left: { style: "medium" },
  bottom: { style: "medium" },
  right: { style: "medium" },
};

/**
 * Applies styling to a worksheet after data has been written.
 * Inserts header rows at the top, adds "No SJ" column, and applies background colors and borders.
 */
const applyWorksheetStyling = (worksheet: Worksheet): Worksheet => {
  // Insert 5 blank rows at the top to make room for the header section
  worksheet.insertRows(1, [[], [], [], [], []]);

  // Column header row (row 6 = HEADER_ROWS_COUNT + 1)
  const columnHeaderRow = HEADER_ROWS_COUNT + 1;

  // Get column count before any modifications
  const columnCount = worksheet.columnCount;

  // Clear column header metadata to prevent ExcelJS from rendering headers in row 1
  // The header property in worksheet.columns causes ExcelJS to auto-render headers
  if (worksheet.columns) {
    worksheet.columns = worksheet.columns.map((col) => ({
      ...col,
      header: undefined,
    }));
  }

  // Clear any stray values in rows 1-5 (columns 2 onwards may have header artifacts)
  for (let row = 1; row < columnHeaderRow; row++) {
    for (let col = 2; col <= columnCount; col++) {
      worksheet.getCell(row, col).value = null;
    }
  }

  // Add header content
  worksheet.getCell("A1").value = "PT PERANCAH PRO ALAT";
  worksheet.getCell("A1").font = { bold: true };

  // Dynamic project name using worksheet name
  worksheet.getCell("A4").value = `PROYEK : ${worksheet.name}`;
  worksheet.getCell("A4").font = { bold: true };

  // Rename "Tanggal" to "Tgl" in the column header
  const tanggalCell = worksheet.getCell(columnHeaderRow, 1);
  if (tanggalCell.value === "Tanggal") {
    tanggalCell.value = "Tgl";
  }

  // Insert "No SJ" column at position 2 (after Tgl, before alat columns)
  const rowCount = worksheet.rowCount;

  // Insert empty column at position 2
  worksheet.spliceColumns(2, 0, []);

  // Fill the "No SJ" column: header in row 6, empty string for all data rows
  for (let row = 1; row <= rowCount; row++) {
    const cell = worksheet.getCell(row, 2);
    if (row === columnHeaderRow) {
      cell.value = "No SJ";
    } else if (row > columnHeaderRow) {
      cell.value = "";
    }
  }

  // Get the updated column count after inserting the new column
  const updatedColumnCount = worksheet.columnCount;

  // Apply bold and medium borders to column header row, and tan background ONLY to this row
  for (let col = 1; col <= updatedColumnCount; col++) {
    const cell = worksheet.getCell(columnHeaderRow, col);
    cell.font = { bold: true };
    cell.border = MEDIUM_BORDER;
    cell.fill = TAN_FILL;
  }

  // Apply thin borders to data area (from row 7 onwards)
  for (let row = columnHeaderRow + 1; row <= rowCount; row++) {
    for (let col = 1; col <= updatedColumnCount; col++) {
      const cell = worksheet.getCell(row, col);
      cell.border = THIN_BORDER;
    }
  }

  // Adjust column widths
  worksheet.getColumn(1).width = 28; // Tgl column (wide enough for "Total Sewa Periode December")
  worksheet.getColumn(2).width = 24; // No SJ column (2x width)

  // Dynamic width for alat columns (columns 3 onwards) based on header text length
  for (let col = 3; col <= updatedColumnCount; col++) {
    const headerCell = worksheet.getCell(columnHeaderRow, col);
    const headerText = String(headerCell.value || "");
    // Minimum width of 10, or header length + 2 for padding
    const dynamicWidth = Math.max(10, headerText.length + 2);
    worksheet.getColumn(col).width = dynamicWidth;
  }

  return worksheet;
};

export type ConvertRekapansOptions = {
  applyStyles?: boolean;
};

export const convertRekapansJSToRekapanWorkbook = (
  rekapansJS: Record<RekapanDate, RekapanWorkbook>,
  options: ConvertRekapansOptions = { applyStyles: true }
): Workbook => {
  const writeFirstRekapanToWorkbook = (
    workbook: Workbook,
    rekapanJS: RekapanWorkbook
  ): void => {
    pipe(
      rekapanJS,
      objectEntries,
      A.map(([companyName, rekapanWorksheet]) => {
        const worksheetName = pipe(companyName, cleanWorksheetName);

        const writeRekapanWorksheetToWorkbook: IO<Worksheet> = () => {
          return pipe(
            workbook,
            (wb) => getOrCreateAndAddWorksheet(wb, worksheetName),
            (ws) => writeHeaderNames(rekapanWorksheet.header, ws),
            (ws) =>
              writePrevBulanTotalSewaAlatAmount(rekapanWorksheet.header, ws),
            (ws) => {
              const mergedRows = mergeRecordsByDate(rekapanWorksheet.records);
              mergedRows.forEach((row) => {
                writeRow(row, ws);
              });
              return ws;
            },
            (ws) =>
              writeCurrentBulanTotalSewaAlatAmount(rekapanWorksheet.header, ws)
          );
        };

        return writeRekapanWorksheetToWorkbook();
      })
    );
  };

  const writeNonFirstRekapanToWorkbook = (
    workbook: Workbook,
    rekapanJS: RekapanWorkbook
  ): void => {
    const extendHeaderNames = <RekapanHeader extends Record<AlatName, any>>(
      rekapanHeader: RekapanHeader,
      worksheet: Worksheet
    ) => {
      const existingColumns = worksheet.columns ?? [];

      // console.log({ existingColumns });

      const currentWorksheetColumns = pipe(
        rekapanHeader,
        objectEntries,
        A.map(([alatName]) => {
          return {
            header: alatName,
            key: alatName,
            width: 10,
          };
        }),
        A.filter((each) => {
          return existingColumns.some((existingColumn) =>
            deepEqual(each, existingColumn)
          );
        })
      );

      const newColumns = [
        ...currentWorksheetColumns,
        ...existingColumns,
      ] satisfies Partial<Column>[];

      worksheet.columns = newColumns;

      return worksheet;
    };

    pipe(
      rekapanJS,
      objectEntries,
      A.map(([companyName, rekapanWorksheet]) => {
        const worksheetName = pipe(companyName, cleanWorksheetName);

        const writeRekapanWorksheetToWorkbook: IO<Worksheet> = () => {
          return pipe(
            workbook,
            (wb) => getOrCreateAndAddWorksheet(wb, worksheetName),
            (ws) => extendHeaderNames(rekapanWorksheet.header, ws),
            (ws) => {
              const mergedRows = mergeRecordsByDate(rekapanWorksheet.records);
              mergedRows.forEach((row) => {
                writeRow(row, ws);
              });
              return ws;
            },
            (ws) =>
              writeCurrentBulanTotalSewaAlatAmount(rekapanWorksheet.header, ws)
          );
        };

        return writeRekapanWorksheetToWorkbook();
      })
    );
  };
  const workbook = createWorkbook();

  const sortByDate = fromCompare(
    (x: [RekapanDate, RekapanWorkbook], y: [RekapanDate, RekapanWorkbook]) => {
      return dayjs(x[0]).isBefore(dayjs(y[0])) ? -1 : 1;
    }
  );

  const sortedRekapansJS = pipe(
    rekapansJS,
    objectEntries,
    A.sort(sortByDate),
    A.map(([_, rekapanWorkbook]) => rekapanWorkbook)
  );

  writeFirstRekapanToWorkbook(workbook, sortedRekapansJS[0]!);

  const sortedNonFirstRekapansJS = sortedRekapansJS.slice(1);

  const writeNonFirstRekapansToWorkbook = () => {
    for (const rekapanJS of sortedNonFirstRekapansJS) {
      writeNonFirstRekapanToWorkbook(workbook, rekapanJS);
    }
  };

  writeNonFirstRekapansToWorkbook();

  // Apply styling to all worksheets (if enabled)
  if (options.applyStyles) {
    workbook.eachSheet((worksheet) => {
      applyWorksheetStyling(worksheet);
    });
  }

  return workbook;
};
