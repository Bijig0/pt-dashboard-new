import ExcelJS from 'exceljs';
import { DataTagihanRowSchema, DataTagihanSchema } from '../schema/schema.js';

type Args = {
  mainDataTagihan: DataTagihanSchema;
  groupedDataTagihanRows: DataTagihanRowSchema[][];
};

export const writeMainDataTagihanWorkbook = async ({
  mainDataTagihan,
  groupedDataTagihanRows,
}: Args): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data Tagihan');

  // Add mainDataTagihan rows
  mainDataTagihan.forEach((row) => {
    worksheet.addRow(row);
  });

  // Add a divider row
  worksheet.addRow([]); // Empty row acts as a divider

  // Add groupedDataTagihanRows with a blank row between each group
  groupedDataTagihanRows.forEach((group, index) => {
    group.forEach((row) => {
      worksheet.addRow(row);
    });

    // Add a blank row after each group, except the last one
    if (index < groupedDataTagihanRows.length - 1) {
      worksheet.addRow([]);
    }
  });

  return workbook;
};
