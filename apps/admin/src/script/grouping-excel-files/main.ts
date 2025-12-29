/**
 * Three phases
 *
 * 1. Input all the groups
 *
 * 2. Groups the inputs from the workbook
 *
 * 3. Filters out the dates from the main input and crushes the blank rows
 *
 * 4. Create a new worksheet that contains the filtered at the top
 * and the grouped at the bottom
 */

import { groupDataTagihan } from './group-data-tagihan/group-data-tagihan.js';
import { readGroupedInputsCLI } from './read-grouped-inputs-cli.js';
const filePath = 'PPH 23, DATA TAGIHAN SD 2024.xlsx';

const OUTFILE_BASE_PATH = `${__dirname}/out`;

const createOutFilePath = (path: string) => `${OUTFILE_BASE_PATH}${path}`;

const main = async () => {
  const cliInputs = await readGroupedInputsCLI();

  const finishedWorkbook = await groupDataTagihan({
    groupedInputs: cliInputs,
    inputWorkbookFilePath: filePath,
  });

  const outFilePath = createOutFilePath(`done.xlsx`);

  finishedWorkbook.xlsx.writeFile(outFilePath);
};

// @ts-ignore
if (import.meta.main) {
  main();
}
