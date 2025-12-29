import ExcelJS, { Workbook, Worksheet } from "exceljs";
import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import { IO } from "fp-ts/lib/IO";
import { pipe } from "fp-ts/lib/function";
import { objectEntries, objectFromEntries } from "ts-extras";
import convertMonthNumberToWord from "../../convertMonthNumberToWord";
import { AlatName } from "../types";
type ExcelJSWritableRow = { Tanggal: string | undefined } & Record<
  AlatName,
  string | undefined | number | null
>;

export const writeRow = (
  record: Record<PropertyKey, any>,
  worksheet: Worksheet
) => worksheet.addRow(record);

export const createAndAddWorksheet = (
  workbook: Workbook,
  worksheetName: string
): Worksheet => {
  return workbook.addWorksheet(worksheetName);
};

export const getOrCreateAndAddWorksheet = (
  workbook: Workbook,
  worksheetName: string
): Worksheet => {
  const ws = workbook.getWorksheet(worksheetName);
  if (ws !== undefined) return ws;
  return createAndAddWorksheet(workbook, worksheetName);
};

export const writeHeaderNames = <RekapanHeader extends Record<AlatName, any>>(
  rekapanHeader: RekapanHeader,
  worksheet: Worksheet
): Worksheet => {
  worksheet.columns = pipe(
    rekapanHeader,
    objectEntries,
    A.map(([alatName]) => {
      return {
        header: alatName,
        key: alatName,
        width: 10,
      };
    }),
    A.prepend({ header: "Tanggal", key: "Tanggal", width: 12 })
  );
  return worksheet;
};

export const writePrevBulanTotalSewaAlatAmount = <
  RekapanHeader extends Record<
    AlatName,
    { prevBulanTotalSewaAlatAmount: number; rekapanMonth: number }
  >,
>(
  rekapanHeader: RekapanHeader,
  worksheet: Worksheet
): Worksheet => {
  const createPrevBulanTotalSewaAlatAmountRow = (): ExcelJSWritableRow => {
    const getRekapanMonth = (): number => {
      const key = Object.keys(rekapanHeader)[0];
      if (key === undefined) throw new Error("No keys found");
      const header = rekapanHeader[key];
      if (header === undefined) throw new Error("No header found");
      return header.rekapanMonth;
    };

    const rekapanMonth = getRekapanMonth();
    return pipe(
      rekapanHeader,
      R.toEntries,
      A.map(([alatName, { prevBulanTotalSewaAlatAmount }]) => {
        return [alatName, prevBulanTotalSewaAlatAmount] as const;
      }),
      A.prependW([
        "Tanggal",
        `Total Sewa Periode ${convertMonthNumberToWord(rekapanMonth - 1)}`,
      ] as const),
      objectFromEntries
    );
  };

  const row = createPrevBulanTotalSewaAlatAmountRow();

  writeRow(row, worksheet);

  return worksheet;
};

export const writeCurrentBulanTotalSewaAlatAmount = <
  RekapanHeader extends Record<
    AlatName,
    {
      currentBulanTotalSewaAlatAmount: number;
      alatName: AlatName;
      rekapanMonth: number;
    }
  >,
>(
  rekapanHeader: RekapanHeader,
  worksheet: Worksheet
): Worksheet => {
  const createCurrentBulanTotalSewaAlatAmountRow = (): ExcelJSWritableRow => {
    const getRekapanMonth = (): number => {
      const key = Object.keys(rekapanHeader)[0];
      if (key === undefined) throw new Error("No keys found");
      const header = rekapanHeader[key];
      if (header === undefined) throw new Error("No header found");
      return header.rekapanMonth;
    };

    const rekapanMonth = getRekapanMonth();

    return pipe(
      rekapanHeader,
      R.toEntries,
      A.map(([alatName, { currentBulanTotalSewaAlatAmount }]) => {
        return [alatName, currentBulanTotalSewaAlatAmount] as const;
      }),
      A.prependW([
        "Tanggal",
        `Total Sewa Periode ${convertMonthNumberToWord(rekapanMonth)}`,
      ] as const),
      objectFromEntries
    );
  };

  const row = createCurrentBulanTotalSewaAlatAmountRow();

  writeRow(row, worksheet);

  return worksheet;
};
export const createRecordRow = <
  WorksheetRecordCell extends {
    alatName: AlatName;
    stokDifference: number | null;
    tanggal: string;
  },
>(
  record: WorksheetRecordCell
): ExcelJSWritableRow => {
  return {
    Tanggal: record.tanggal,
    [record.alatName]: record.stokDifference,
  };
};

export const logSheetValuesAndReturn = (ws: Worksheet) => {
  console.log({ ws: ws.getSheetValues() });
  return ws;
};

export const createWorkbook: IO<Workbook> = () => new ExcelJS.Workbook();
