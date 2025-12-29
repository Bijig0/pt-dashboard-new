import { excelFileToExcelJs } from "#src/helpers/excelFileToExcelJs.js";
import { cleanStokAlat } from "#src/script/stok-alat-to-js/clean-stok-alat-excel/clean-stok-alat/clean-stok-alat.js";
import {
  cleanedStokAlatToJS,
  StokAlat,
} from "#src/script/stok-alat-to-js/cleaned-stok-alat-to-js/cleaned-stok-alat-to-js.js";
import {
  DataError,
  findStokAlatDataErrors,
} from "#src/script/stok-alat-to-js/find-stok-alat-data-errors/find-stok-alat-data-errors.js";
import ExcelJS from "exceljs";

export type AddNewStokAlatArgs = {
  stokAlatFile: File;
  allowedCompanyNames: string[];
};

export type Return =
  | {
      data: StokAlat[];
      errors: null;
    }
  | {
      data: ExcelJS.Workbook;
      errors: DataError[];
    };

export const validateNewStokAlat = async ({
  stokAlatFile,
  allowedCompanyNames,
}: AddNewStokAlatArgs) => {
  let workbook: ExcelJS.Workbook;
  try {
    const _workbook = await excelFileToExcelJs(stokAlatFile);
    workbook = _workbook;
  } catch (error) {
    console.error(error);
  }

  const cleanedWorkbook = await cleanStokAlat(workbook!);

  const { workbook: workbookIdentity, errors } = await findStokAlatDataErrors({
    workbook: cleanedWorkbook,
    allowedCompanyNames,
  });

  if (errors.length > 0) {
    return { data: null, errors };
  }

  const { stokAlat } = cleanedStokAlatToJS({
    workbook: workbookIdentity,
    alatName: "Alat X",
  });

  return { data: stokAlat, errors: null };
};
