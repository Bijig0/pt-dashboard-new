import ExcelJS from "exceljs";
import { getWorkbookRows } from "../getWorkbookRows.js";
import { collectGroupedRows } from "./collectGroupedRows/collectGroupedRows.js";
import { filterMainDataTagihan } from "./filterMainDataTagihan/filterMainDataTagihan.js";
import { sortCliInputs } from "./sortCliInputs/sortCliInputs.js";
import { writeGroupedDataTagihanWorkbook } from "./writeGroupedDataTagihanWorkbook/writeGroupedDataTagihanWorkbook.js";

type Args = {
  groupedInputs: string[][];
  inputWorkbookFilePath: string;
};

export const groupDataTagihan = async ({
  groupedInputs,
  inputWorkbookFilePath,
}: Args): Promise<ExcelJS.Workbook> => {
  const sortedCliInputs = sortCliInputs({ rows: groupedInputs });

  console.log({ sortedCliInputs });

  const { dataTagihan: workbookRows, header } = await getWorkbookRows({
    filePath: inputWorkbookFilePath,
  });

  console.log({ workbookRows });

  const groupedDataTagihanRows = await collectGroupedRows({
    workbookRows: workbookRows,
    rowsToCollect: sortedCliInputs,
  });

  // console.log({ groupedDataTagihanRows });

  const mainTagihanRowsWithoutCliInputs = filterMainDataTagihan({
    mainDataTagihan: workbookRows,
    rowsToFilter: groupedDataTagihanRows,
  });

  console.log(
    mainTagihanRowsWithoutCliInputs.find((row) => row[1].includes("0596"))
  );

  const finishedWorkbook = await writeGroupedDataTagihanWorkbook({
    header,
    groupedDataTagihanRows,
  });

  return finishedWorkbook;
};

const outFilePath =
  "src/script/grouping-excel-files/group-data-tagihan/out/out.xlsx";

type Group = {
  group: string[];
  dateFor: string;
};

// the 1. 282, 2. 223 243, 3. 226,229 the /23 and an 880 at the bottom
// @ts-ignore
if (import.meta.main) {
  const groupedInputs = [
    ["2", "3"],
    ["5", "6"],
    // ["282", "47", "363"],

    // ["397"],
    // ["421"],
    // ["467"],
    // ["464"],
    // ["466"],
    // ["465"],
    // ["392"],
    // ["373"],
    // ["224", "227", "228", "230", "233", "235", "236", "237", "259", "260"],
    // ["179", "180", "181", "216", "217", "278", "280", "313", "314"],
    // ["515", "516", "517", "518"],
    // ["492", "493"],
    // ["468"],
    // ["469"],
    // ["263", "317", "334", "354", "369", "376"],
    // ["483", "484", "485"],
    // ["284", "285", "303"],
    // ["399", "400"],
    // ["442", "443", "444"],
    // ["482"],
    // ["439"],
    // ["374", "375", "381", "382"],
    // ["338", "362"],
    // ["283", "345"],

    // ["199", "403", "405", "880", "419"],
  ];
  const inFilePath = "group-data-tagihan/in/normal.xlsx";
  const workbook = await groupDataTagihan({
    groupedInputs,
    inputWorkbookFilePath: inFilePath,
  });

  // console.log(getRows(workbook.getWorksheet("Data Tagihan")!));

  workbook.xlsx.writeFile(outFilePath);
}
