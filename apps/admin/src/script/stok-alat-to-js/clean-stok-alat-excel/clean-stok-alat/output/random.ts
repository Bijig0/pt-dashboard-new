import { convertExcelFileToWorkbookFormatted } from "#src/helpers/convertExcelFileToWorkbookFormatted.js";

// @ts-ignore
if (import.meta.main) {
  const dirname = new URL(".", import.meta.url).pathname;

  const excelExpectedOutputFilePath = "normal-cut-down.xlsx";
  const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted({
    dirname,
    path: excelExpectedOutputFilePath,
  });
}
