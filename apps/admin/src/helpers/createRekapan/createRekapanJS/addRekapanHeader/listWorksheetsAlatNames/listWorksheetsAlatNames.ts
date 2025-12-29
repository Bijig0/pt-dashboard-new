import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";
import * as S from "fp-ts/string";
import { get } from "spectacles-ts";
import { merge } from "ts-deepmerge";
import { RekapanWorkbookObj } from "../../../../../hooks/useGetRekapanData";
import { AlatName, CompanyName, RekapanWorkbookBody } from "../../../types";

export const listWorksheetsAlatNames = (
  currentMonthWorksheets: RekapanWorkbookBody,
  prevMonthRekapan: RekapanWorkbookObj
): Record<CompanyName, AlatName[]> => {
  const currentMonthWorksheetsAlatNames = pipe(
    currentMonthWorksheets,
    R.map((worksheet) => {
      return pipe(
        worksheet.records,
        A.map(get("alatName")),
        A.uniq(S.Eq)
      );
    })
  ) satisfies Record<CompanyName, AlatName[]>;

  const prevMonthWorksheetsAlatNames = pipe(
    prevMonthRekapan,
    R.map(({ header }) => {
      return pipe(
        header,
        R.keys,
        A.filter((headerKey) => headerKey !== "Tanggal")
      );
    })
  );

  return merge(prevMonthWorksheetsAlatNames, currentMonthWorksheetsAlatNames);
};
