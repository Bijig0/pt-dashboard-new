import ExcelJS from "exceljs";
import { calculateTotal } from "./calculateTotal";
import { convertFormulaCellsToResult } from "./convertFormulaCellsToResult";
import { getAllRows } from "./getAllRows";
import { transformToItems } from "./transformToItems";
import {
  cleanedDataTagihanSchema,
  dataTagihanSchema,
  ItemsSchema,
  WorksheetInfo,
} from "./types";

type Params = {
  worksheet: ExcelJS.Worksheet;
  worksheetInfo: WorksheetInfo;
};

type Return = {
  items: ItemsSchema;
  total: number;
};

export const createItems = (params: Params): Return => {
  const { worksheet, worksheetInfo } = params;

  const rows = getAllRows(worksheet);

  const parsedRows = dataTagihanSchema.parse(rows);

  const slicedRows = parsedRows
    .slice(worksheetInfo.itemsStartRow - 1, worksheetInfo.itemsEndRow)
    .map((row) => [
      row[worksheetInfo.itemNameColumn],
      row[worksheetInfo.itemPriceColumn],
    ]);

  const cleanedRows = convertFormulaCellsToResult(slicedRows);

  const slicedRowsParsed = cleanedDataTagihanSchema.parse(cleanedRows);

  const items = transformToItems(slicedRowsParsed);

  const total = calculateTotal(items);

  return {
    items,
    total,
  };
};
