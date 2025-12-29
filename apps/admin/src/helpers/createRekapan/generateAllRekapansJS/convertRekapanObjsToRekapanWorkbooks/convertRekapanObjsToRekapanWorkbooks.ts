import { Workbook } from "exceljs";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";
import { convertRekapanJSToRekapanWorkbook } from "../../convertRekapanJSToRekapanWorkbook/convertRekapanJSToRekapanWorkbook";
import { RekapanDate } from "../../convertRekapansJSToRekapanWorkbook";
import { RekapanWorkbook } from "../../types";

export const convertRekapanObjsToRekapanWorkbooks = (
  rekapanObjs: Record<RekapanDate, RekapanWorkbook>
): Record<RekapanDate, Workbook> => {
  return pipe(rekapanObjs, R.map(convertRekapanJSToRekapanWorkbook));
};
