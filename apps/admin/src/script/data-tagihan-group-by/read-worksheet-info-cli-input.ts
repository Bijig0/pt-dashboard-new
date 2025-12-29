import inquirer from "inquirer";
import { worksheetDataSchema, WorksheetDataSchema } from "./types";

export async function readWorksheetInfoCLI(): Promise<WorksheetDataSchema> {
  const answers = await inquirer.prompt([
    {
      type: "number",
      name: "itemNameColumn",
      message: "Enter the column number for item names:",
      validate: (value) => !isNaN(value) || "Please enter a valid number",
    },
    {
      type: "number",
      name: "itemPriceColumn",
      message: "Enter the column number for item prices:",
      validate: (value) => !isNaN(value) || "Please enter a valid number",
    },
    {
      type: "number",
      name: "itemsStartRow",
      message: "Enter the start row number for items:",
      validate: (value) => !isNaN(value) || "Please enter a valid number",
    },
    {
      type: "number",
      name: "itemsEndRow",
      message: "Enter the end row number for items:",
      validate: (value) => !isNaN(value) || "Please enter a valid number",
    },
    {
      type: "input",
      name: "outFileName",
      message: "Enter the out file name:",
      validate: (value) => typeof value === "string" || value instanceof String,
    },
  ]);

  return worksheetDataSchema.parse(answers);
}
