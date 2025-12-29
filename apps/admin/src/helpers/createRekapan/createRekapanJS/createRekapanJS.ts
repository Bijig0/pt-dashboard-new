import * as O from "fp-ts/Option";
import { Option } from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";
import { RekapanWorkbookObj } from "../../../hooks/useGetRekapanData";
import { SupabaseWorksheetDataSchema } from "../../../pages/services/first-one/getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";
import { RekapanWorkbook, RekapanWorkbookBody } from "../types";
import { addRekapanHeader } from "./addRekapanHeader/addRekapanHeader";
import { addUnusedPrevMonthRekapanCompanyNames } from "./addUnusedPrevMonthRekapanCompanyNames/addUnusedPrevMonthRekapanCompanyNames";
import formatRecords from "./formatRecords/formatRecords";
import sortRecordsByDate from "./sortRecordsByDate/sortRecordsByDate";
import { groupByCompanyName } from "./groupByCompanyName/groupByCompanyName";

export const createRekapanJS = (
  records: SupabaseWorksheetDataSchema,
  prevMonthRekapan: Option<RekapanWorkbookObj>,
  rekapanMonth?: number
): RekapanWorkbook => {
  // console.log({ records });
  // console.log(JSON.stringify(records, null, 2));

  const formattedRecords = formatRecords(records);

  console.log({ formattedRecords });

  const rekapanWorkbookBody = pipe(
    formattedRecords,
    groupByCompanyName,
    sortRecordsByDate,
    (currentMonthRekapanBody) => {
      return pipe(
        prevMonthRekapan,
        O.map((prevMonthRekapan) =>
          addUnusedPrevMonthRekapanCompanyNames(
            prevMonthRekapan,
            currentMonthRekapanBody
          )
        ),
        O.getOrElse(() => currentMonthRekapanBody)
      );
    }
  ) satisfies RekapanWorkbookBody as RekapanWorkbookBody;

  console.log({ keys: Object.keys(rekapanWorkbookBody) });

  console.log("Rekapan Workbook Body");
  console.log(JSON.stringify(rekapanWorkbookBody, null, 2));

  console.log("Prev Month Rekapan");
  console.log(JSON.stringify(prevMonthRekapan, null, 2));

  const rekapanWorkbook = addRekapanHeader(
    rekapanWorkbookBody,
    prevMonthRekapan,
    rekapanMonth
  );

  // console.log(JSON.stringify(rekapanWorkbook, null, 2));

  return rekapanWorkbook;
};

// @ts-ignore
if (import.meta.main) {
  const rekapan = {
    "Company A": {
      currentBulanTotalSewaAlatAmount: {
        Alat1: 1000,
        Alat2: 2000,
      },
      prevBulanTotalSewaAlatAmount: {},
      header: {
        Tanggal: { colIndex: 0 },
        Alat1: { colIndex: 1 },
        Alat2: { colIndex: 2 },
      },
      records: [],
    },
    "Company B": {
      currentBulanTotalSewaAlatAmount: {
        Alat3: 3000,
      },
      prevBulanTotalSewaAlatAmount: {},
      header: {
        Tanggal: { colIndex: 0 },
        Alat3: { colIndex: 1 },
      },
      records: [],
    },
  } satisfies RekapanWorkbookObj;

  const currentMonthStokAlatData = [
    {
      tanggal: "25/12/2023",
      masuk: 123,
      keluar: 0,
      company_name: { name: "Company A" },
      alat_name: { name: "Alat1" },
    },
    {
      tanggal: "01/12/2023",
      masuk: 789,
      keluar: 0,
      company_name: { name: "Company B" },
      alat_name: { name: "Alat2" },
    },
  ] satisfies SupabaseWorksheetDataSchema;

  const result = createRekapanJS(currentMonthStokAlatData, O.some(rekapan));

  console.log(JSON.stringify(result, null, 2));
}
