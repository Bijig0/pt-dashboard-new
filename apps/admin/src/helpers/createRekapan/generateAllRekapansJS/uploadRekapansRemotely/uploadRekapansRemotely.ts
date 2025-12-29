import { Workbook } from "exceljs";
import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import { objectEntries } from "ts-extras";
import { uploadRekapanRemotely } from "../../../../pages/services/first-one/grid/io/uploadRekapanRemotely";
import { RekapanDate } from "../../convertRekapansJSToRekapanWorkbook";

export const uploadRekapansRemotely = async (
  rekapans: Record<RekapanDate, Workbook>
) => {
  const uploadPromises = pipe(
    rekapans,
    objectEntries,
    A.map(async ([date, rekapanWorkbook]) => {
      const dateObject = new Date(date);
      await uploadRekapanRemotely(rekapanWorkbook, dateObject);
    })
  );

  await Promise.all(uploadPromises);
};
