import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import * as S from "fp-ts/string";
import { logAndPipe } from "../../../../../helpers/createRekapan/createRekapanJS/addRekapanHeader/addRekapanHeader";
import { clusterCompanyNames } from "./clusterCompanyNames";
import { ClusteredCompanyNames, CorrectCompanyName, Row } from "./types";
import { SupabaseWorksheetDataSchema } from "../../getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";

export const retrieveCompanyNames = (
  currentMonthStokAlatData: SupabaseWorksheetDataSchema
) => {
  return pipe(
    currentMonthStokAlatData,
    A.map((each) => each.company_name.name),
    A.uniq(S.Eq)
  );
};
export const doFullThing = (
  currentMonthStokAlatData: SupabaseWorksheetDataSchema,
  prevMonthCorrectCompanyNames: Record<CorrectCompanyName, Row> | undefined
): ClusteredCompanyNames => {
  return pipe(
    currentMonthStokAlatData,
    retrieveCompanyNames,
    logAndPipe,
    (currentMonthCompanyNames) =>
      clusterCompanyNames(
        currentMonthCompanyNames,
        prevMonthCorrectCompanyNames
      )
  );
};
