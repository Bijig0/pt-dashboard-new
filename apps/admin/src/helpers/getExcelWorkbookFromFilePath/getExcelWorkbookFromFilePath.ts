import * as ExcelJS from "exceljs";

export const getExcelWorkbookFromFilePath = async (
  filePath: string
): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  return workbook;
};
