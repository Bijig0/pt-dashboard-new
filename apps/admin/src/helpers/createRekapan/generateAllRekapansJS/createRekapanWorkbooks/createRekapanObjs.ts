import { ClusteredCompanyNames } from "../../../../pages/services/first-one/generate-rekapan/group-company-typo-names/types";
import { SupabaseWorksheetDataSchema } from "../../../../pages/services/first-one/getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";
import yyyy_mm_dd_formatDate from "../../../yyyy_mm_dd_formatDate";
import { RekapanDate } from "../../convertRekapansJSToRekapanWorkbook";
import { RekapanWorkbook } from "../../types";
import { generateSingleRekapanObj } from "./generateSingleRekapanObj/generateSingleRekapanObj";

export const createRekapanObjs = async (
  datesToCreateRekapanFor: Date[],
  startRekapanCreationDate: Date,
  waitForModalConfirmation: (
    currentMonthStokAlatData: SupabaseWorksheetDataSchema
  ) => Promise<ClusteredCompanyNames>
): Promise<Record<RekapanDate, RekapanWorkbook>> => {
  const rekapanPromises = datesToCreateRekapanFor.map(async (date) => {
    const rekapan = await generateSingleRekapanObj(
      date,
      startRekapanCreationDate,
      waitForModalConfirmation
    );
    console.dir({ rekapan }, { depth: null });
    return [yyyy_mm_dd_formatDate(date), rekapan] as const;
  });

  const rekapanEntries = await Promise.all(rekapanPromises);
  const rekapans = Object.fromEntries(rekapanEntries);
  return rekapans;
};
