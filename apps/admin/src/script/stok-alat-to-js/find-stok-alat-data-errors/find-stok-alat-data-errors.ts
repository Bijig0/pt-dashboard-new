import ExcelJS from "exceljs";
import { exceljsCleaning } from "./exceljs-cleaning/exceljs-cleaning";
import { createStokAlatDataError } from "./validate-stok-alat-row/create-stok-alat-data-error/create-stok-alat-data-error";
import { validateStokAlatRow } from "./validate-stok-alat-row/validate-stok-alat-row";

export type DataError = {
  worksheetName: string;
  rowNumber: number;
  errorMessage: string;
};

type Return = {
  workbook: ExcelJS.Workbook;
  errors: DataError[];
};

type Args = {
  workbook: ExcelJS.Workbook;
  allowedCompanyNames: string[];
};

export const findStokAlatDataErrors = async ({
  workbook,
  allowedCompanyNames,
}: Args): Promise<Return> => {
  const worksheetErrors: DataError[] = [];

  workbook.eachSheet((worksheet, sheetId) => {
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const cells = row.values;

      const exceljsClenaedCells = exceljsCleaning(cells);

      const { errors: rowErrors } = validateStokAlatRow({
        rows: exceljsClenaedCells,
        allowedCompanyNames,
      });

      if (rowErrors.length > 0) {
        for (const error of rowErrors) {
          const stokAlatDataError = createStokAlatDataError({
            worksheetName: worksheet.name,
            rowNumber,
            errorMessage: error.message,
          });

          worksheetErrors.push(stokAlatDataError);
        }
      }
    });
  });

  return { workbook, errors: worksheetErrors };
};

// @ts-ignore
if (import.meta.main) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  worksheet.addRow(["tanggal", "companyName", "masuk", "keluar"]);
  worksheet.addRow([new Date(), 123, 10, null]); // Invalid
  worksheet.addRow([new Date(), "Company B", null, 20]); // Valid

  const allowedCompanyNames = ["Company A", "Company B"];

  const { workbook: _, errors } = await findStokAlatDataErrors({
    workbook,
    allowedCompanyNames,
  });

  console.log({ errors });
}
