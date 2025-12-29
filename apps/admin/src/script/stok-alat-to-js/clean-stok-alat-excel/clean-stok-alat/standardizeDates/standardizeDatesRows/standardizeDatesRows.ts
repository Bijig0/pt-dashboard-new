import { Row } from "#src/script/types.js";
import { coerceToDate, replaceOWithZero } from "../../../../utils/utils";

const TGL_COLUMN_INDEX = 0;

export const standardizeDatesRows = (rows: Row[]): Row[] => {
  const rowsWithoutTGLHeader = rows.slice(1);

  const r = rowsWithoutTGLHeader.map((row) => {
    const tglCell = row[TGL_COLUMN_INDEX];
    if (!(tglCell instanceof Date)) return row;
    // Doing this because exceljs automatically consumes dates as dd/mm/yyyy format
    // const dayAndMonthSwapped = swapDayAndMonth(tglCell);
    return [tglCell, ...row.slice(1)];
  });

  console.log({ r });

  const dateStringsAsDates = r.map((row) => {
    const tglCell = row[TGL_COLUMN_INDEX];
    if (tglCell instanceof Date) return row;
    const dateString = tglCell;
    if (typeof tglCell !== "string") return row;
    const dateStringCleaned = replaceOWithZero(dateString as string);
    const { value: date } = coerceToDate(dateStringCleaned);
    if (date === null) throw new Error("Invalid date");
    console.log({ date });
    return [date, ...row.slice(1)];
  });

  console.log({ dateStringsAsDates });

  const withTGLHeader = [rows[0]!, ...dateStringsAsDates];

  return withTGLHeader;
};

// @ts-ignore
if (import.meta.main) {
  const rows = [
    ["TGL", "CB 220"],
    ["05/09/2024", 0],
    ["06/09/2024", 0],
  ];
  const result = standardizeDatesRows(rows);

  console.log({ result });
}
