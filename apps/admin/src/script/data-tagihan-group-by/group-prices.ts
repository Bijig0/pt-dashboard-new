import ExcelJS from "exceljs";
import { assert } from "tsafe";
import { createItems } from "./createItems/createItems";
import { FormattedItems } from "./formatItemPrices/formatItemPrices";
import { groupItemsByName } from "./groupItems/groupItems";
import { sortItemsByName } from "./sortItemsByName/sortItemsByName";
import { WorksheetInfo } from "./types";
import { ItemsSchema } from "./createItems/schema/schema";

type Params = {
  worksheet: ExcelJS.Worksheet;
  worksheetInfo: WorksheetInfo;
};

type Return = {
  groupedItems: ItemsSchema;
  total: number;
};

export const groupPrices = async (params: Params): Promise<Return> => {
  const { worksheet, worksheetInfo } = params;

  const { items, total: initialTotal } = createItems({
    worksheet,
    worksheetInfo,
  });

  const { items: groupedItems, total: totalAfterGroup } = groupItemsByName({
    items,
  });

  assert(initialTotal === totalAfterGroup);

  const sortedItems = sortItemsByName(groupedItems);

  return { groupedItems: sortedItems, total: initialTotal };
};
