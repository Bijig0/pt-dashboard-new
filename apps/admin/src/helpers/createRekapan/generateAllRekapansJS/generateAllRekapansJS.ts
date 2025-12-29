import { eachMonthOfInterval, endOfMonth } from "date-fns";
import { ClusteredCompanyNames } from "../../../pages/services/first-one/generate-rekapan/group-company-typo-names/types";
import { SupabaseWorksheetDataSchema } from "../../../pages/services/first-one/getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";
import { convertRekapanObjsToRekapanWorkbooks } from "./convertRekapanObjsToRekapanWorkbooks/convertRekapanObjsToRekapanWorkbooks";
import { createRekapanObjs } from "./createRekapanWorkbooks/createRekapanObjs";
import { uploadRekapansRemotely } from "./uploadRekapansRemotely/uploadRekapansRemotely";

function getEndOfMonthDatesBetween(startDate: Date, endDate: Date) {
  return eachMonthOfInterval({
    start: startDate,
    end: endDate,
  }).map(endOfMonth);
}

export type TypoCompanyName = string & {};
export type CorrectCompanyName = string & {};

// export const generateAllRekapansJS = async (
//   startRekapanCreationDate: Date,
//   endRekapanCreationDate: Date,
//   waitForModalConfirmation: (
//     currentMonthStokAlatData: SupabaseWorksheetDataSchema
//   ) => Promise<ClusteredCompanyNames>
// ) => {
//   console.log({ startRekapanCreationDate, endRekapanCreationDate });
//   const datesToCreateRekapanFor = getEndOfMonthDatesBetween(
//     startRekapanCreationDate,
//     endRekapanCreationDate
//   );

//   const rekapans: Record<RekapanDate, Workbook> = {};

//   const rekapanObjs: Record<RekapanDate, RekapanWorkbook> = {};

//   for (const dateToCreateRekapanFor of datesToCreateRekapanFor) {
//     const rekapan = await generateSingleRekapanObj(
//       dateToCreateRekapanFor,
//       startRekapanCreationDate,
//       waitForModalConfirmation
//     );

//     console.log({ rekapan });

//     rekapanObjs[yyyy_mm_dd_formatDate(dateToCreateRekapanFor)] = rekapan;

//     const rekapanWorkbook = convertRekapanJSToRekapanWorkbook(rekapan);
//     await uploadRekapanRemotely(rekapanWorkbook, dateToCreateRekapanFor);
//   }
// };

// TODO: REFACTOR generateAllRekapans into this, but right now, test cases pass for generateAllRekapans so idrc honestly
export const generateAllRekapansJS = async (
  startRekapanCreationDate: Date,
  endRekapanCreationDate: Date,
  waitForModalConfirmation: (
    currentMonthStokAlatData: SupabaseWorksheetDataSchema
  ) => Promise<ClusteredCompanyNames>
) => {
  const datesToCreateRekapanFor = getEndOfMonthDatesBetween(
    startRekapanCreationDate,
    endRekapanCreationDate
  );

  const rekapanObjs = await createRekapanObjs(
    datesToCreateRekapanFor,
    startRekapanCreationDate,
    waitForModalConfirmation
  );

  const rekapanWorkbooks = convertRekapanObjsToRekapanWorkbooks(rekapanObjs);

  await uploadRekapansRemotely(rekapanWorkbooks);
};
