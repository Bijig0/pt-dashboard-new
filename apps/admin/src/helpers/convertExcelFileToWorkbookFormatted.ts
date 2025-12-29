import {
  WorksheetName,
  convertExcelJSWorkbookToWorkbookFormatted,
} from "./convertExcelJSWorkbookToWorkbookFormatted/convertExcelJSWorkbookToWorkbookFormatted";
import { createExcelExpectedFilePath } from "./createExcelExpectedFilePath/createExcelExpectedFilePath";
import { CleanedWorksheetSchema } from "./excel-types";
import { getExcelWorkbookFromFilePath } from "./getExcelWorkbookFromFilePath/getExcelWorkbookFromFilePath";

type Args = {
  dirname: string;
  path: string;
};

/**
 * This function is for taking in a local excel file and turning it into a formatted workbook in javascript
 * it is mainly (and currently I think ONLY) used for testing purposes to match against an existing excel file
 */
export const convertExcelFileToWorkbookFormatted = async ({
  dirname,
  path,
}: Args): Promise<Record<WorksheetName, CleanedWorksheetSchema>> => {
  const ExcelFilePath = createExcelExpectedFilePath({
    dirname: dirname,
    path,
  });

  console.log({ ExcelFilePath });

  const Workbook = await getExcelWorkbookFromFilePath(ExcelFilePath);

  const WorkbookFormatted =
    await convertExcelJSWorkbookToWorkbookFormatted(Workbook);

  return WorkbookFormatted;
};
