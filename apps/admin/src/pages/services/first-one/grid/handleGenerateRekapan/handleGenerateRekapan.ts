import { isSameDay } from "date-fns";
import { Workbook } from "exceljs";
import * as O from "fp-ts/Option";
import { createRekapanExcelWorkbook } from "../../../../../helpers/createRekapan/createRekapanExcelWorkbook";
import downloadExcelFile from "../../../../../helpers/downloadExcelFile";
import { RekapanWorkbookObj } from "../../../../../hooks/useGetRekapanData";
import { getCurrentMonthStokAlatData } from "../../getCurrentMonthStokAlatData/getCurrentMonthStokAlatData";
import { uploadRekapanRemotely } from "../io/uploadRekapanRemotely";
import { buildInitialRekapanFromValues, InitialTotalSewaAlat } from "./buildInitialRekapanFromValues/buildInitialRekapanFromValues";
import { getPrevMonthRekapanToUse } from "./getPrevMonthRekapanToUse/getPrevMonthRekapanToUse";

export const generateSingleRekapanWorkbook = async (
  rekapanToCreateDate: Date,
  startRekapanCreationDate: Date,
  initialTotalSewaAlat?: InitialTotalSewaAlat
): Promise<Workbook> => {
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

  const rekapan = createRekapanExcelWorkbook(parsedData, prevMonthRekapanToUse);

  return rekapan;
};

export const handleGenerateRekapan = async (
  rekapanToCreateDate: Date,
  startRekapanCreationDate: Date,
  initialTotalSewaAlat?: InitialTotalSewaAlat
) => {
  // Change this to use fp-ts later on once you make the wrapper from supabaseToTe
  // So that you can use TaskEithers instead for this whole thing

  const rekapan = await generateSingleRekapanWorkbook(
    rekapanToCreateDate,
    startRekapanCreationDate,
    initialTotalSewaAlat
  );

  downloadExcelFile(rekapan, "output.xlsx");

  uploadRekapanRemotely(rekapan, rekapanToCreateDate);
};
