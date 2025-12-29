import ExcelJS from "exceljs";
import { createExcelExpectedFilePath } from "../../../src/helpers/createExcelExpectedFilePath/createExcelExpectedFilePath.js";
import { cleanExcelJSRows } from "../cleanExcelJSRows.js";
import { getRows } from "../getRows.js";
import { convertFormulaCellsToResult } from "./convertFormulaCellToResult.js";
import {
  DataTagihanRowSchema,
  DataTagihanSchema,
  dataTagihanSchema,
} from "./group-data-tagihan/schema/schema.js";

type Args = {
  filePath: string;
  
};

type Return = {
  dataTagihan: DataTagihanSchema;
  header: DataTagihanRowSchema;
};

export const getWorkbookRows = async ({ filePath }: Args): Promise<Return> => {
  const __dirname = new URL(".", import.meta.url).pathname;

  const inFilePath = createExcelExpectedFilePath({
    dirname: __dirname,
    path: filePath,
  });

  console.log({ inFilePath });

  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(inFilePath);

  const worksheet = workbook.getWorksheet("2024")!;

  const rows = getRows(worksheet);

  const cleanedRows = cleanExcelJSRows(rows);

  const header = cleanedRows[0]!;

  const records = cleanedRows.slice(1);

  const formulaCellsAsResults = convertFormulaCellsToResult(records);

  const parsedRows = dataTagihanSchema.parse(formulaCellsAsResults);

  return { dataTagihan: parsedRows, header };
};
