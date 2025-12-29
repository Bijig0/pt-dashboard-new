import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import { assert, objectKeys } from "tsafe";
import { z } from "zod";
import { AlatName } from "../../../../../../helpers/createRekapan/types";
import precondition from "../../../../../../utils/precondition";
import { AgGridRow } from "../../../grid";
import { createMockRow } from "./createMockRow";

const stringsSchema = z.array(z.string());

const TANGGAL_LITERAL = "tanggal";

/**
 * Given worksheet data, it gets the alat names from a given row
 *
 */
export const getCurrentWorksheetAlatNames = (
  worksheetData: AgGridRow[]
): AlatName[] => {
  precondition(worksheetData.length > 0, "Worksheet data is empty");

  return pipe(
    worksheetData[0]!,
    objectKeys,
    (keys) => {
      assert(
        stringsSchema
          .parse(keys)
          .map((key) => key.toLowerCase())
          .includes(TANGGAL_LITERAL)
      );
      return keys;
    },
    A.filter((key) => {
      const parsedKey = z.string().parse(key);
      return parsedKey.toLowerCase() !== TANGGAL_LITERAL;
    }),
    stringsSchema.parse
  );
};

// @ts-ignore
if (import.meta.main) {
  const row = [createMockRow(["Tanggal", "alat1", "ALAT2", "Alat3"])];

  const result = getCurrentWorksheetAlatNames(row);

  console.log({ result });
}
