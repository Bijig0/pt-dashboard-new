import { merge } from "fp-ts-std/Struct";
import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";
import * as S from "fp-ts/string";
import { objectFromEntries } from "ts-extras";
import { RekapanWorkbookObj } from "../../../../hooks/useGetRekapanData";
import { RekapanWorkbookBody } from "../../types";

/**
 * This is used for propogation of company names between rekapans
 *
 * Say the first month has Company A only with a full rekapan
 *
 * the second month has Company B only with a full rekapan
 *
 * If we stop the rekapan creation at company B, we would lose company A without this function
 *
 * This function will add company A to the rekapan workbook, and only its company name without records
 *
 */
export const addUnusedPrevMonthRekapanCompanyNames = (
  prevMonthRekapan: RekapanWorkbookObj,
  currentMonthRekapanBody: RekapanWorkbookBody
): RekapanWorkbookBody => {
  const uniquePrevMonthRekapanCompanyNames = pipe(
    prevMonthRekapan,
    R.keys,
    A.difference(S.Eq)(pipe(currentMonthRekapanBody, R.keys)),
    A.map((companyName) => [companyName, { records: [] }] as const),
    objectFromEntries
  ) satisfies RekapanWorkbookBody;

  return pipe(
    currentMonthRekapanBody,
    merge(uniquePrevMonthRekapanCompanyNames)
  );
};
