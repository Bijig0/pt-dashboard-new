import { excelFileToExcelJs } from "#src/helpers/excelFileToExcelJs.js";
import {
  convertExcelFileToArrays,
  RekapanWorksheetObjSchema,
} from "#src/hooks/useGetRekapanData.js";
import ExcelJS from "exceljs";
import { getCurrentWorksheetAlatNames } from "../../../confirm-generate-tagihan/confirm-generate-tagihan-button/getCurrentWorksheetAlatNames/getCurrentWorksheetAlatNames";
import { AgGridRow } from "../../../types";

export type ValidateRekapanArgs = {
  rekapanFile: File;
};

export type ValidateRekapanReturn =
  | {
      data: null;
      errors: Error;
    }
  | {
      data: {
        rekapan: {
          [x: string]: string | number | undefined;
        }[];
        alatNames: string[];
      };
      errors: null;
    };

export const validateRekapan = async ({
  rekapanFile,
}: ValidateRekapanArgs): Promise<ValidateRekapanReturn> => {
  let workbook: ExcelJS.Workbook;
  try {
    const _workbook = await excelFileToExcelJs(rekapanFile);
    workbook = _workbook;
  } catch (error) {
    throw error;
  }

  const worksheetName = workbook.worksheets[0]?.name!;
  let worksheetData: RekapanWorksheetObjSchema;
  try {
    const _worksheetData = convertExcelFileToArrays(workbook, worksheetName);
    worksheetData = _worksheetData;
  } catch (error) {
    if (error instanceof Error) {
      return { errors: error, data: null };
    }
  }

  const worksheetDataWithoutHeader = [
    worksheetData!.prevBulanTotalSewaAlatAmount,
    ...worksheetData!.records,
    worksheetData!.currentBulanTotalSewaAlatAmount,
  ] as AgGridRow[];

  const currentWorksheetAlatNames = getCurrentWorksheetAlatNames(
    worksheetDataWithoutHeader
  );

  return {
    data: {
      rekapan: worksheetDataWithoutHeader,
      alatNames: currentWorksheetAlatNames,
    },
    errors: null,
  };
};
