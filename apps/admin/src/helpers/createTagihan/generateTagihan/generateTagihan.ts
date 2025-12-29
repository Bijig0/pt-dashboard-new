import { pipe } from "fp-ts/lib/function";

export type AlatRecord = {
  alatName: string;
  jumlahAlat: number;
  hargaBulanan: number;
  hargaHarian: number;
} & {};

export type Input = {
  tanggal: string;
  alatRecords: AlatRecord[];
}[] & {};

export type SingleAlat = {
  tanggal: string;
  jumlah: number;
  hargaBulanan: number;
  hargaHarian: number;
}[] & {};

type SingleAlatRecords = {
  records: SingleAlat;
} & {};

export type GroupedRecord = {
  [key: AlatName]: {
    [key: `${string}-${"Sewa" | "Retur"}`]:
      | {
          tanggal: string;
          jumlah: number;
          hargaBulanan: number;
          hargaHarian: number;
        }[]
      | undefined;
  };
} & {};

export type Output = {
  [key: AlatName]: {
    records: TagihanAlatRecords[];
    subTotal: number;
    harga: number;
  };
} & {};

type AlatName = string & {};

export type ToReturn = Record<AlatName, SingleAlatRecords>;

import dayjsUtc from "@dayjsutc";
import console from "console";
import { Dayjs } from "dayjs";
import { Workbook } from "exceljs";
import { merge } from "ts-deepmerge";
import { convertExcelJSWorkbookToWorkbookFormatted } from "../../convertExcelJSWorkbookToWorkbookFormatted/convertExcelJSWorkbookToWorkbookFormatted";
import { convertTagihanJSToWorkbook } from "../convertTagihanJSToWorkbook/convertTagihanJSToWorkbook";
import { TagihanAlatRecords } from "../types";
import { annotateSubtotalPerRecord } from "./annotateSubtotalPerRecord/annotateSubtotalPerRecord";
import { calculateTagihanTotals } from "./calculateTagihanTotals/calculateTagihanTotals";
import { getRecords } from "./getRecords/getRecords";
import getTagihanBulananTotals from "./getTagihanBulananTotals/getTagihanBulananTotals";
import { getTagihanRegularSewaTotals } from "./getTagihanRegularSewaTotals/getTagihanRegularSewaTotals";

type BikinTagiahnArgs = {
  rekapanData: Input;
  periodToCreateTagihanFor: Dayjs;
};

export const bikinTagihan = ({
  rekapanData,
  periodToCreateTagihanFor,
}: BikinTagiahnArgs): Workbook => {
  console.log({ rekapanData });

  const { recordsIncludingPrevBulanTotalSewaAlatAmount, recordsOnly } =
    getRecords(rekapanData);

  const tagihanBulananTotals = getTagihanBulananTotals({
    records: recordsIncludingPrevBulanTotalSewaAlatAmount,
    periodToCreateTagihanFor,
  });

  console.dir({ tagihanBulananTotals }, { depth: null });

  const tagihanRegularSewaTotals = getTagihanRegularSewaTotals(recordsOnly);

  console.log({ tagihanRegularSewaTotals });

  const tagihanTotals = pipe(
    merge(tagihanRegularSewaTotals, tagihanBulananTotals),
    annotateSubtotalPerRecord
  );

  console.log({ tagihanTotals });

  const calculated = pipe(tagihanTotals, calculateTagihanTotals);

  console.log({ calculated });

  const asExcelFile = convertTagihanJSToWorkbook(calculated);

  return asExcelFile;
};

export default bikinTagihan;

// @ts-ignore
if (import.meta.main && !import.meta.env.PROD) {
  const mockData = [
    {
      tanggal: "Sisa Alat",
      alatRecords: [
        {
          alatName: "Alat 1",
          jumlahAlat: 10,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
        {
          alatName: "Alat 2",
          jumlahAlat: 20,
          hargaBulanan: 300,
          hargaHarian: 10,
        },
      ],
    },
    {
      tanggal: "12/01/2024",
      alatRecords: [
        {
          alatName: "Alat 1",
          jumlahAlat: 5,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
      ],
    },
    {
      tanggal: "Sisa Alat",
      alatRecords: [
        {
          alatName: "Alat 1",
          jumlahAlat: 15,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
        {
          alatName: "Alat 2",
          jumlahAlat: 20,
          hargaBulanan: 300,
          hargaHarian: 10,
        },
      ],
    },
  ] satisfies Input as Input;

  const periodToCreateTagihanFor = dayjsUtc("2024-01-15");

  const result = bikinTagihan({
    rekapanData: mockData,
    periodToCreateTagihanFor,
  });

  const resultAsWorkbookFormatted =
    await convertExcelJSWorkbookToWorkbookFormatted(result);

  console.dir(resultAsWorkbookFormatted, { depth: null });

  const OUTFILE_PATH =
    "src/helpers/createTagihan/generateTagihan/mockData/excel-files";

  result.xlsx.writeFile(
    `${OUTFILE_PATH}/generateTagihan-alats-with-intermittent-borrowing-mixed-with-alats-without.xlsx`
  );
}

// So the positives are all the same
// The negatives are all the same

// The per bulan is just calculated by I think the negatives subtracted but can do that at the end
// Yepp ONLY negatives so keep running total

// Also im doing a group by on date but what happens if there's a negative and positive on same date
// You do a group by on both columns
