import { createExcelExpectedFilePath } from "../../../src/helpers/createExcelExpectedFilePath/createExcelExpectedFilePath.js";
import { chooseWorksheet } from "./chooseWorksheet.js";
import { cleanWorksheetRows } from "./cleanWorksheetRows/cleanWorksheetRows.js";
import { groupPrices } from "./group-prices";
import { readWorksheetInfoCLI } from "./read-worksheet-info-cli-input.js";
import { writeGroupedItemsWorkbook } from "./writeGroupedItemsWorkbook/writeGroupedItemsWorkbook.js";

const filePath = "/in/BANK KAS REKAPAN 2025.xlsx";

const OUTFILE_BASE_PATH = `${__dirname}/out/`;

const createOutFilePath = (path: string) => `${OUTFILE_BASE_PATH}${path}`;

const inFilePath = createExcelExpectedFilePath({
  dirname: __dirname,
  path: filePath,
});

const main = async () => {
  const worksheet = await chooseWorksheet({
    inputWorkbookFilePath: inFilePath,
  });

  // Clean the worksheet by removing rows before TGL header and blank rows
  const cleanedWorksheet = cleanWorksheetRows({ worksheet });

  const worksheetInfo = await readWorksheetInfoCLI();

  const { groupedItems, total } = await groupPrices({
    worksheet: cleanedWorksheet,
    worksheetInfo,
  });

  const writtenWorkbook = await writeGroupedItemsWorkbook({
    items: groupedItems,
    total,
  });

  const outFilePath = createOutFilePath(`${worksheetInfo.outFileName}.xlsx`);

  writtenWorkbook.xlsx.writeFile(outFilePath);
};

// @ts-ignore
if (import.meta.main) {
  main();
}
