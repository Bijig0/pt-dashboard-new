import { readFile } from "#src/helpers/readFile";
import ExcelJS from "exceljs";

export const excelFileToExcelJs = async (
  fileRes: File
): Promise<ExcelJS.Workbook> => {
  const buffer = await readFile(fileRes);

  const workbook = new ExcelJS.Workbook();
  const excelJsWorkbook = await workbook.xlsx.load(buffer as Buffer);

  return excelJsWorkbook;
};
