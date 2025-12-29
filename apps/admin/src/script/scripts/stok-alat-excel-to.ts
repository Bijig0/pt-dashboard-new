import ExcelJS from "exceljs";
import { cleanStokAlat } from "../stok-alat-to-js/clean-stok-alat-excel/clean-stok-alat/clean-stok-alat";
import { findStokAlatDataErrors } from "../stok-alat-to-js/find-stok-alat-data-errors/find-stok-alat-data-errors";

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

const main = async () => {
  const workbook = await getStokAlatExcelWorkbook(EXCEL_FILE_PATH);

  const cleanedWorkbook = await cleanStokAlat(workbook);

  const { workbook: sameWorkbook, errors } =
    await findStokAlatDataErrors(cleanedWorkbook);

  if (errors.length > 0) {
    // Replace this with something you can pass in
    console.log("Errors found");
  }

  console.log(cleanedWorkbook);
};

main();
