import { getExcelWorkbookFromFilePath } from "#src/helpers/getExcelWorkbookFromFilePath/getExcelWorkbookFromFilePath.js";
import { convertExcelFileToArrays } from "#src/hooks/useGetRekapanData.js";
import { cleanWorksheetData } from "#src/pages/services/bikin-tagihan/confirm-generate-tagihan/confirm-generate-tagihan-modal/confirm-generate-tagihan-modal.js";
import {
  AgGridRow,
  cleanAGGridColumnName,
} from "#src/pages/services/bikin-tagihan/grid.js";
import { HargaAlatSchema } from "#src/types/schemas.js";
import { Dayjs } from "dayjs";
import ExcelJS from "exceljs";
import * as A from "fp-ts/Array";
import { flow } from "lodash";
import { objectEntries, objectFromEntries } from "ts-extras";
import bikinTagihan from "../generateTagihan/generateTagihan";

type Args = {
  rekapanExcelFilePath: string;
  worksheetName: string;
  alatPrices: HargaAlatSchema;
  periodToCreateTagihanFor: Dayjs;
};

export const rekapanExcelFileToTagihan = async ({
  rekapanExcelFilePath,
  worksheetName,
  alatPrices,
  periodToCreateTagihanFor,
}: Args): Promise<ExcelJS.Workbook> => {
  // Takes in a file path to an excel file, does transformations,
  // then gives you something else back in return
  // Let's make it give a workbook in return right yeah

  const workbook = await getExcelWorkbookFromFilePath(rekapanExcelFilePath);

  const rekapanWorksheet = convertExcelFileToArrays(workbook, worksheetName);

  const cleanWorksheetDataAlatNames = flow(
    objectEntries,
    A.map(([alatName, _]) => [cleanAGGridColumnName(alatName), _] as const),
    objectFromEntries
  );

  const worksheetDataWithoutHeader = [
    cleanWorksheetDataAlatNames(rekapanWorksheet.prevBulanTotalSewaAlatAmount),
    ...rekapanWorksheet.records.map(cleanWorksheetDataAlatNames),
    cleanWorksheetDataAlatNames(
      rekapanWorksheet.currentBulanTotalSewaAlatAmount
    ),
  ];

  const cleanedWorksheetData = cleanWorksheetData(
    worksheetDataWithoutHeader as AgGridRow[],
    alatPrices
  );

  const tagihan = bikinTagihan({
    rekapanData: cleanedWorksheetData,
    periodToCreateTagihanFor: periodToCreateTagihanFor,
  });

  return tagihan;
};
