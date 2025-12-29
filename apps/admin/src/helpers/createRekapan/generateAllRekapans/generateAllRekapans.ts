import console, { assert } from "console";
import { eachMonthOfInterval, endOfMonth, format, getMonth, isSameDay } from "date-fns";
import { Workbook } from "exceljs";
import * as O from "fp-ts/Option";
import { RekapanWorkbookObj } from "../../../hooks/useGetRekapanData";
import { buildInitialRekapanFromValues, InitialTotalSewaAlat } from "../../../pages/services/first-one/grid/handleGenerateRekapan/buildInitialRekapanFromValues/buildInitialRekapanFromValues";
import { getCurrentMonthStokAlatData } from "../../../pages/services/first-one/getCurrentMonthStokAlatData/getCurrentMonthStokAlatData";
import { getPrevMonthRekapanToUse } from "../../../pages/services/first-one/grid/handleGenerateRekapan/getPrevMonthRekapanToUse/getPrevMonthRekapanToUse";
import { uploadRekapanRemotely } from "../../../pages/services/first-one/grid/io/uploadRekapanRemotely";
import { checkParsableToDateDDMMYYYY } from "../../../utils/checkParsableToDateDDMMYYYY/checkParsableToDateDDMMYYYY";
import precondition from "../../../utils/precondition";
import downloadExcelFile from "../../downloadExcelFile";
import yyyy_mm_dd_formatDate from "../../yyyy_mm_dd_formatDate";
import { convertRekapanJSToRekapanWorkbook } from "../convertRekapanJSToRekapanWorkbook/convertRekapanJSToRekapanWorkbook";
import {
  RekapanDate,
  convertRekapansJSToRekapanWorkbook,
} from "../convertRekapansJSToRekapanWorkbook";
import { createRekapanJS } from "../createRekapanJS/createRekapanJS";
import { RekapanWorkbook } from "../types";

export type ProgressUpdate = {
  currentMonth: number;
  totalMonths: number;
  monthName: string;
  status: "fetching-data" | "generating" | "uploading" | "completed";
};

export type ProgressCallback = (update: ProgressUpdate) => void;

export function getEndOfMonthDatesBetween(startDate: Date, endDate: Date) {
  precondition(startDate <= endDate, "Start date is after end date");

  return eachMonthOfInterval({
    start: startDate,
    end: endDate,
  }).map(endOfMonth);
}

const generateSingleRekapanObj = async (
  rekapanToCreateDate: Date,
  startRekapanCreationDate: Date,
  initialTotalSewaAlat?: InitialTotalSewaAlat
): Promise<RekapanWorkbook> => {
  console.log({ rekapanToCreateDate, startRekapanCreationDate });
  const isStartRekapanCreationDate = isSameDay(
    rekapanToCreateDate,
    startRekapanCreationDate
  );

  const parsedData = await getCurrentMonthStokAlatData(rekapanToCreateDate);

  const prevMonthRekapanToUse: O.Option<RekapanWorkbookObj> =
    isStartRekapanCreationDate && initialTotalSewaAlat
      ? O.some(buildInitialRekapanFromValues(parsedData, initialTotalSewaAlat))
      : isStartRekapanCreationDate
      ? O.none
      : O.some(await getPrevMonthRekapanToUse(rekapanToCreateDate));

  assert(
    parsedData.every(
      ({ tanggal }) => checkParsableToDateDDMMYYYY(tanggal) === true
    ),
    `All tanggals must be in DD/MM/YYYY format`
  );

  console.log({ parsedData });

  // getMonth returns 0-indexed month (January = 0), matching dayjs convention
  const rekapanMonth = getMonth(rekapanToCreateDate);

  const rekapan = createRekapanJS(parsedData, prevMonthRekapanToUse, rekapanMonth);

  console.dir({ rekapan }, { depth: 2 });

  return rekapan;
};

const generateAllRekapans = async (
  startRekapanCreationDate: Date,
  endRekapanCreationDate: Date,
  initialTotalSewaAlat?: InitialTotalSewaAlat,
  onProgress?: ProgressCallback
) => {
  console.log({ startRekapanCreationDate, endRekapanCreationDate });
  const datesToCreateRekapanFor = getEndOfMonthDatesBetween(
    startRekapanCreationDate,
    endRekapanCreationDate
  );

  const totalMonths = datesToCreateRekapanFor.length;
  const rekapans: Record<RekapanDate, Workbook> = {};

  const rekapanObjs: Record<RekapanDate, RekapanWorkbook> = {};

  for (let i = 0; i < datesToCreateRekapanFor.length; i++) {
    const dateToCreateRekapanFor = datesToCreateRekapanFor[i];
    const currentMonth = i + 1;
    const monthName = format(dateToCreateRekapanFor, "MMMM yyyy");

    // Report: fetching data
    onProgress?.({
      currentMonth,
      totalMonths,
      monthName,
      status: "fetching-data",
    });

    const rekapan = await generateSingleRekapanObj(
      dateToCreateRekapanFor,
      startRekapanCreationDate,
      initialTotalSewaAlat
    );

    // Report: generating worksheet
    onProgress?.({
      currentMonth,
      totalMonths,
      monthName,
      status: "generating",
    });

    console.dir({ rekapan }, { depth: null });

    rekapanObjs[yyyy_mm_dd_formatDate(dateToCreateRekapanFor)] = rekapan;

    const rekapanWorkbook = convertRekapanJSToRekapanWorkbook(rekapan);

    // Report: uploading
    onProgress?.({
      currentMonth,
      totalMonths,
      monthName,
      status: "uploading",
    });

    await uploadRekapanRemotely(rekapanWorkbook, dateToCreateRekapanFor);

    // Report: completed this month
    onProgress?.({
      currentMonth,
      totalMonths,
      monthName,
      status: "completed",
    });
  }

  console.dir({ rekapanObjs }, { depth: null });

  const workbook = convertRekapansJSToRekapanWorkbook(rekapanObjs);

  downloadExcelFile(workbook, "rekapans.xlsx");

  return [rekapanObjs, workbook] as const;

  // const entries = objectEntries(rekapans);

  // const bufferEntries: [RekapanDate, ExcelJS.Buffer][] = [];

  // for (const [rekapanDate, workbook] of entries) {
  //   const asBuffer = await workbookToBuffer(workbook);
  //   bufferEntries.push([rekapanDate, asBuffer]);
  // }

  // const asObjectBuffers = objectFromEntries(bufferEntries) as Record<
  //   RekapanDate,
  //   Buffer
  // >;

  // zipFiles(asObjectBuffers, "rekapans");

  // Now I want to put all of it into a ip file and then save
};

export default generateAllRekapans;
