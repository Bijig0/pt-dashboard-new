import { Worksheet } from "exceljs";
import * as E from "fp-ts/Either";
import { Either } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { assert } from "tsafe";
import { CleanedWorksheetSchema } from "../../helpers/excel-types";
import { safeParseWorksheet } from "../../helpers/excel/safeParseWorksheet";
import { cleanWorksheetArrays } from "../useGetRekapanData";

export const convertExcelWorksheetToArrays = (
  worksheet: Worksheet
): Either<Error, CleanedWorksheetSchema> => {
  return pipe(
    worksheet.getSheetValues(),
    (sheetValues) => {
      assert(sheetValues.length > 0, "Worksheet must have at least 1 row");
      assert(
        sheetValues[0] === undefined,
        "First item from exceljs sheetValues is undefined"
      );
      return sheetValues;
    },
    safeParseWorksheet,
    E.map(cleanWorksheetArrays)
  );
};
