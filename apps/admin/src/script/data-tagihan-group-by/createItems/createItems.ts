import ExcelJS from "exceljs";
import { convertFormulaCellsToResult } from "../../../../src/script/grouping-excel-files/convertFormulaCellToResult.js";
import { getAllRows } from "../getAllRows.js";
import { WorksheetInfo } from "../types";
import { calculateTotal } from "./calculateTotalPrice/calculateTotal.js";
import {
  cleanedDataTagihanSchema,
  dataTagihanSchema,
  ItemsSchema,
} from "./schema/schema";
import { transformToItems } from "./transformToItems/transformToItems";

type Params = {
  worksheet: ExcelJS.Worksheet;
  worksheetInfo: WorksheetInfo;
};

type Return = {
  items: ItemsSchema;
  total: number;
} & {};

export const createItems = (params: Params): Return => {
  const { worksheet, worksheetInfo } = params;

  const rows = getAllRows(worksheet);

  const parsedRows = dataTagihanSchema.parse(rows);

  console.log({ parsedRows });

  console.log(parsedRows.length);

  const slicedRows = parsedRows
    .slice(worksheetInfo.itemsStartRow - 1, worksheetInfo.itemsEndRow)
    .map((row) => [
      row[worksheetInfo.itemNameColumn],
      row[worksheetInfo.itemPriceColumn],
    ]);

  console.log({ slicedRows });

  const cleanedRows = convertFormulaCellsToResult(slicedRows);

  const slicedRowsParsed = cleanedDataTagihanSchema.parse(cleanedRows);

  const items = transformToItems(slicedRowsParsed);

  const total = calculateTotal(items);

  return {
    items,
    total,
  };
};
