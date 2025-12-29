import { convertExcelFileToWorkbookFormatted } from "#src/helpers/convertExcelFileToWorkbookFormatted.js";
import { convertExcelJSWorkbookToWorkbookFormatted } from "#src/helpers/convertExcelJSWorkbookToWorkbookFormatted/convertExcelJSWorkbookToWorkbookFormatted.js";
import { createExcelExpectedFilePath } from "#src/helpers/createExcelExpectedFilePath/createExcelExpectedFilePath.js";
import ExcelJS from "exceljs";
import { cleanStokAlat } from "./clean-stok-alat";

describe("clean-stok-alat", () => {
  it.todo("cuts down the excel file to the tgl row", async () => {
    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedInputFilePath = "/input/normal.xlsx";
    const filePath = createExcelExpectedFilePath({
      dirname,
      path: excelExpectedInputFilePath,
    });
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx.readFile(filePath);

    const result = await cleanStokAlat(workbook);

    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);

    const excelExpectedOutputFilePath = "/output/normal-cut-down.xlsx";
    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedOutputFilePath,
      }
    );

    // expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
  });
});
