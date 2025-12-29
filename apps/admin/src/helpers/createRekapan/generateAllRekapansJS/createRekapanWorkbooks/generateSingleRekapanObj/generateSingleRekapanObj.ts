import { isSameDay } from "date-fns";
import * as O from "fp-ts/lib/Option";
import { assert } from "tsafe";
import { RekapanWorkbookObj } from "../../../../../hooks/useGetRekapanData";
import { ClusteredCompanyNames } from "../../../../../pages/services/first-one/generate-rekapan/group-company-typo-names/types";
import { getCurrentMonthStokAlatData } from "../../../../../pages/services/first-one/getCurrentMonthStokAlatData/getCurrentMonthStokAlatData";
import { SupabaseWorksheetDataSchema } from "../../../../../pages/services/first-one/getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";
import { buildInitialRekapanFromValues, InitialTotalSewaAlat } from "../../../../../pages/services/first-one/grid/handleGenerateRekapan/buildInitialRekapanFromValues/buildInitialRekapanFromValues";
import { getPrevMonthRekapanToUse } from "../../../../../pages/services/first-one/grid/handleGenerateRekapan/getPrevMonthRekapanToUse/getPrevMonthRekapanToUse";
import { checkParsableToDateDDMMYYYY } from "../../../../../utils/checkParsableToDateDDMMYYYY/checkParsableToDateDDMMYYYY";
import { createRekapanJS } from "../../../createRekapanJS/createRekapanJS";
import { invertClusteredTypoCompanyNames } from "../../../invertClusteredTypoCompanyName";
import { RekapanWorkbook } from "../../../types";
import { standardizeStokAlatWorksheetTypoCompanyNames } from "./standardizeStokAlatWorksheetTypoCompanyNames/standardizeStokAlatWorksheetTypoCompanyNames";

export const generateSingleRekapanObj = async (
  rekapanToCreateDate: Date,
  startRekapanCreationDate: Date,
  waitForModalConfirmation: (
    currentMonthStokAlatData: SupabaseWorksheetDataSchema
  ) => Promise<ClusteredCompanyNames>,
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

  const clusteredTypoCompanyNames = await waitForModalConfirmation(parsedData);

  const standardized = standardizeStokAlatWorksheetTypoCompanyNames(
    invertClusteredTypoCompanyNames(clusteredTypoCompanyNames),
    parsedData
  );

  console.log({ standardized });

  // const filterCheck = standardized.filter((each) => {
  //   return each.company_name.name.startsWith("ACSET ADM");
  // });

  // console.log({ filterCheck });

  console.log({ parsedData });

  const rekapan = createRekapanJS(standardized, prevMonthRekapanToUse);

  console.dir({ rekapan }, { depth: null });

  return rekapan;
};
