import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const workbookToBuffer = async (
  workbook: ExcelJS.Workbook
): Promise<Buffer> => {
  return (await workbook.xlsx.writeBuffer()) as Buffer;
};

const downloadExcelFile = async (
  workbook: ExcelJS.Workbook,
  outFileName: string
) => {
  const buffer = await workbookToBuffer(workbook);
  saveAs(new Blob([buffer]), outFileName);
};

export default downloadExcelFile;
