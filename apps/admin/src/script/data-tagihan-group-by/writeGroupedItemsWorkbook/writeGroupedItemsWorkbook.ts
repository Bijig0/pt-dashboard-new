import ExcelJS from "exceljs";
import { ItemsSchema } from "../createItems/schema/schema";

type Args = {
  header?: [string, string];
  items: ItemsSchema;
  total: number;
};

const fillStyle = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFFFFFFF" },
} as const;

const borderStyle = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
} as const;

export const writeGroupedItemsWorkbook = async ({
  items,
  header = ["KETERANGAN", "KELUAR"],
  total,
}: Args): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  // Add header row
  const headerRow = worksheet.addRow(header);
  headerRow.font = { bold: true };

  // Add items
  items.forEach((item) => {
    const newRow = worksheet.addRow([item.itemName, item.itemPrice]);

    newRow.eachCell((cell, colNumber) => {
      cell.fill = fillStyle;
      cell.border = borderStyle;

      // Format second column (price column) with comma-separated thousands
      if (colNumber === 2) {
        cell.numFmt = "#,##0";
      }
    });
  });

  worksheet.addRow([]);

  // Add total row with comma-separated formatting
  const totalRow = worksheet.addRow(["", total]);
  totalRow.getCell(2).numFmt = "#,##0";
  totalRow.getCell(2).fill = fillStyle;
  totalRow.getCell(2).border = borderStyle;

  // Auto-adjust column widths
  worksheet.columns.forEach((column) => {
    column.width = column.width! < 20 ? 20 : column.width;
  });

  return workbook;
};
