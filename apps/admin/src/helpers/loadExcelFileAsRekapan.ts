import { Workbook, Worksheet } from "exceljs";
import _ from "lodash";
import { z } from "zod";

function fillEmptySlotsWithUndefined(arr: any[]) {
  if (arr.length < 4) {
    console.log(arr.concat(new Array(4 - arr.length).fill(undefined)));
    return arr.concat(new Array(4 - arr.length).fill(undefined));
  } else {
    return arr;
  }
}

const rekapanRowSchema = z
  .object({
    tanggal: z.date(),
  })
  .merge(
    z.object({
      alatNames: z.record(z.string().min(1), z.number().optional()),
    })
  );

type RekapanRow = z.infer<typeof rekapanRowSchema>;

const rekapanWorksheetSchema = z.array(rekapanRowSchema);

type RekapanWorksheet = z.infer<typeof rekapanWorksheetSchema>;

const getCleanedWorksheetValues = (worksheet: Worksheet): RekapanWorksheet => {
  let header: string[];
  const cleanedWorksheet = worksheet
    .getSheetValues()
    .slice(1)
    .map((row, index) => {
      if (!row) {
        throw new Error("Empty Row");
      }

      const initialUndefinedRemovedRow = row.slice(1);
      if (index === 0) {
        header = initialUndefinedRemovedRow;
        return header;
      }
      const filledWithUndefined = fillEmptySlotsWithUndefined(
        initialUndefinedRemovedRow
      );

      const asObject = {
        tanggal: new Date(filledWithUndefined[0]),
        alatNames: _.zipObject(header.slice(1), filledWithUndefined.slice(1)),
      } satisfies RekapanRow;
      return asObject;
    });

  return cleanedWorksheet;
};

const loadExcelFileAsRekapan = (rekapan: Workbook): RekapanWorksheet => {
  const worksheets = rekapan.worksheets;
  const worksheet = worksheets[0];
  if (worksheet === undefined) throw new Error("No worksheet found");
  const rows = getCleanedWorksheetValues(worksheet);
  const dataRows = rows.slice(1);

  const parsedRows = rekapanWorksheetSchema.parse(dataRows);

  return parsedRows;

  // for (const worksheet of worksheets) {
  // }
};

export default loadExcelFileAsRekapan;
