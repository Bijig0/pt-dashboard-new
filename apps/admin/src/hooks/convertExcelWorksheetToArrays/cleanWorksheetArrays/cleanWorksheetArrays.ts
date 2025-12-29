import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import { assert } from "tsafe";
import {
  CleanedWorksheetSchema,
  WorksheetSchema,
} from "../../../helpers/excel-types";

function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}

export const cleanWorksheetArrays = (
  sheetValues: WorksheetSchema
): CleanedWorksheetSchema => {
  // For some reason undefined is not filtered out by the type system? Fix later
  return pipe(
    sheetValues,
    (sheetValues) => {
      assert(sheetValues.length > 0, "Worksheet must have at least 1 row");
      assert(
        sheetValues[0] === undefined,
        "First item from exceljs sheetValues is undefined"
      );
      return sheetValues;
    },
    // There is undefined as the first row for some reason in exceljs
    A.dropLeft(1),
    // exceljs leaves the first element as undefined for some reason
    A.map((row) => pipe(row!, A.dropLeft(1))),
    A.filter(isDefined)
  );
};
