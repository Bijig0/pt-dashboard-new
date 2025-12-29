import ExcelJS from "exceljs";
import { DataTagihanRowSchema } from "../schema/schema.js";

type Args = {
  header: DataTagihanRowSchema;
  groupedDataTagihanRows: DataTagihanRowSchema[][];
};

const fillStyle = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFCCFFCC" }, // Light green color
} as const;

const borderStyle = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
} as const;

export const writeGroupedDataTagihanWorkbook = async ({
  groupedDataTagihanRows,
  header,
}: Args): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data Tagihan");

  // Add a divider row
  worksheet.addRow(header); // Empty row acts as a divider

  // Add groupedDataTagihanRows with a blank row between each group
  groupedDataTagihanRows.forEach((group, index) => {
    group.forEach((row) => {
      const newRow = worksheet.addRow(row);

      newRow.eachCell((cell) => {
        cell.fill = fillStyle;
        cell.border = borderStyle;
      });
    });

    // Add a blank row after each group, except the last one
    if (index < groupedDataTagihanRows.length - 1) {
      worksheet.addRow([]);
    }
  });

  return workbook;
};
