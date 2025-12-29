import * as ExcelJS from "exceljs";

type WorksheetName = string & {};

export const getExcelWorkbookFromFilePath = async (
  filePath: string
): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  return workbook;
};

// @ts-ignore
if (import.meta.main) {
}
