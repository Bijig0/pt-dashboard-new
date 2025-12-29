import { Workbook } from "exceljs";
import { Option } from "fp-ts/Option";
import { RekapanWorkbookObj } from "../../hooks/useGetRekapanData";
import { SupabaseWorksheetDataSchema } from "../../pages/services/first-one/getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";
import { convertRekapanJSToRekapanWorkbook } from "./convertRekapanJSToRekapanWorkbook/convertRekapanJSToRekapanWorkbook";
import { createRekapanJS } from "./createRekapanJS/createRekapanJS";

export const createRekapanExcelWorkbook = (
  records: SupabaseWorksheetDataSchema,
  prevMonthRekapan: Option<RekapanWorkbookObj>
): Workbook => {
  const rekapanJS = createRekapanJS(records, prevMonthRekapan);
  const workbook = convertRekapanJSToRekapanWorkbook(rekapanJS);
  return workbook;
};
