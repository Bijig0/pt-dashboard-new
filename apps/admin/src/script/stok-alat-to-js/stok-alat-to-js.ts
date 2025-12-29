import ExcelJS from "exceljs";
import { cleanStokAlat } from "./clean-stok-alat-excel/clean-stok-alat/clean-stok-alat";
import {
  cleanedStokAlatToJS,
  StokAlat,
} from "./cleaned-stok-alat-to-js/cleaned-stok-alat-to-js";
import { findStokAlatDataErrors } from "./find-stok-alat-data-errors/find-stok-alat-data-errors";

const EXCEL_FILE_PATH = "placeholder";

const getStokAlatExcelWorkbook = (
  excelFilePath: string
): Promise<ExcelJS.Workbook> => {
  return new Promise((resolve, reject) => {
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx.readFile(excelFilePath).then(() => {
      resolve(workbook);
    });
  });
};

// The problem again is the typo company names

// const workbook = await getStokAlatExcelWorkbook(EXCEL_FILE_PATH);

type Args = {
  workbook: ExcelJS.Workbook;
  allowedCompanyNames: string[];
  alatName: string;
};

export const stokAlatToConsumable = async ({
  workbook,
  allowedCompanyNames,
  alatName,
}: Args): Promise<StokAlat[] | undefined> => {
  const cleanedWorkbook = await cleanStokAlat(workbook);

  const { workbook: workbookIdentity, errors } = await findStokAlatDataErrors({
    workbook: cleanedWorkbook,
    allowedCompanyNames,
  });

  if (errors.length > 0) {
    // Replace this with something you can pass in
    console.log(errors);
    return;
  }

  const { stokAlat } = cleanedStokAlatToJS({
    workbook: workbookIdentity,
    alatName,
  });

  return stokAlat;
};
