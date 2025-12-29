import ExcelJS from "exceljs";
import inquirer from "inquirer";
import { createExcelExpectedFilePath } from "../../../src/helpers/createExcelExpectedFilePath/createExcelExpectedFilePath.js";

type Args = {
  inputWorkbookFilePath: string;
};

export const chooseWorksheet = async ({
  inputWorkbookFilePath,
}: Args): Promise<ExcelJS.Worksheet> => {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(inputWorkbookFilePath);

  const worksheets = workbook.worksheets;

  const worksheetChoices = worksheets.map((worksheet) => ({
    name: worksheet.name,
    value: worksheet,
  }));

  // Prompt user to select a worksheet
  const { selectedWorksheet } = (await inquirer.prompt([
    {
      type: "rawlist",
      name: "selectedWorksheet",
      message: "Choose a worksheet:",
      choices: worksheetChoices,
    },
  ])) as { selectedWorksheet: ExcelJS.Worksheet };

  return selectedWorksheet;
};

// @ts-ignore
if (import.meta.main) {
  const filePath = "/in/BANK 2024.xlsx";

  const inFilePath = createExcelExpectedFilePath({
    dirname: __dirname,
    path: filePath,
  });

  chooseWorksheet({ inputWorkbookFilePath: inFilePath });
}
