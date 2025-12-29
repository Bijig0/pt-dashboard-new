import { endOfMonth, subMonths } from "date-fns";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { getRekapanData } from "../../../../../../helpers/getRekapanData/getRekapanData";
import {
  RekapanWorkbookObj,
  convertExcelWorkbookToRekapanObj,
} from "../../../../../../hooks/useGetRekapanData";

export const getPrevMonthRekapanToUse = async (
  rekapanToCreateDate: Date
): Promise<RekapanWorkbookObj> => {
  const prevMonthDate = pipe(subMonths(rekapanToCreateDate, 1), endOfMonth);

  const prevMonthRekapanExcel = await getRekapanData(prevMonthDate);

  const prevMonthRekapan = pipe(
    prevMonthRekapanExcel,
    convertExcelWorkbookToRekapanObj,
    E.getOrElseW((error) => {
      throw error;
    })
  );

  return prevMonthRekapan;
};
