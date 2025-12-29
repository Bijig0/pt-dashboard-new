import { SupabaseWorksheetDataSchema } from "../../../../../../pages/services/first-one/getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";

export type TypoCompanyName = string & {};
export type CorrectCompanyName = string & {};

export const standardizeStokAlatWorksheetTypoCompanyNames = (
  invertedClusteredTypoCompanyNames: Record<
    TypoCompanyName,
    CorrectCompanyName
  >,
  stokAlatWorksheetData: SupabaseWorksheetDataSchema
): SupabaseWorksheetDataSchema => {
  return stokAlatWorksheetData.map((each) => {
    const stokAlatCompanyName = each.company_name.name;
    const correctCompanyName =
      invertedClusteredTypoCompanyNames[stokAlatCompanyName];
    return {
      ...each,
      company_name: {
        name: correctCompanyName!,
      },
    };
  });
};
