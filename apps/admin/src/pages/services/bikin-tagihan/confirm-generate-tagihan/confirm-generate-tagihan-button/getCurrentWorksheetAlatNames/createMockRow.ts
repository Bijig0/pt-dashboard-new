import { AgGridRow } from "../../../grid";

export const createMockRow = (keys: string[]): AgGridRow => {
  // @ts-ignore
  const row: AgGridRow = {};
  keys.forEach((key) => {
    row[key] = ""; // The value doesn't matter for this test, only the keys
  });
  return row;
};
