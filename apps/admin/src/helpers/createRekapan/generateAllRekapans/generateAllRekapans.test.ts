import { vi } from "vitest";
import { convertExcelJSWorkbookToWorkbookFormatted } from "../../../helpers/convertExcelJSWorkbookToWorkbookFormatted/convertExcelJSWorkbookToWorkbookFormatted";
import { RekapanWorkbookObj } from "../../../hooks/useGetRekapanData";
import { ClusteredCompanyNames } from "../../../pages/services/first-one/generate-rekapan/group-company-typo-names/types";
import * as GetCurrentMonthStokAlatDataModule from "../../../pages/services/first-one/getCurrentMonthStokAlatData/getCurrentMonthStokAlatData";
import { SupabaseWorksheetDataSchema } from "../../../pages/services/first-one/getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";
import * as GetPrevMonthRekapanToUseModule from "../../../pages/services/first-one/grid/handleGenerateRekapan/getPrevMonthRekapanToUse/getPrevMonthRekapanToUse";
import { convertExcelFileToWorkbookFormatted } from "../../convertExcelFileToWorkbookFormatted";
import * as ConvertRekapansModule from "../convertRekapansJSToRekapanWorkbook";
import generateAllRekapans from "./generateAllRekapans";
import * as StandardizeStokAlatWorksheetTypoCompanyNamesModule from "./standardizeStokAlatWorksheetTypoCompanyNames/standardizeStokAlatWorksheetTypoCompanyNames";

const createExcelExpectedFilePath = (fileName: string): string => {
  const __dirname = new URL(".", import.meta.url).pathname;
  const inFilePath = `${__dirname}/generateAllRekapansMockData/excel-files/${fileName}.xlsx`;
  const withoutInitialSlash = inFilePath.slice(1);
  return withoutInitialSlash;
};

const { currentMonthStokAlatData, rekapan } = vi.hoisted(() => {
  const rekapan = {
    // No 0 because the start date never uses a prevMonthRekapan (could change in the future and this comment could be obsolete)
    1: {
      "Company A": {
        currentBulanTotalSewaAlatAmount: {
          Alat1: 123,
        },
        prevBulanTotalSewaAlatAmount: {},
        header: {
          Tanggal: { colIndex: 0 },
          Alat1: { colIndex: 1 },
        },
        records: [],
      },
      "Company B": {
        currentBulanTotalSewaAlatAmount: {
          Alat2: 789,
        },
        prevBulanTotalSewaAlatAmount: {},
        header: {
          Tanggal: { colIndex: 0 },
          Alat2: { colIndex: 1 },
        },
        records: [],
      },
    } satisfies RekapanWorkbookObj,
    // NOTE THAT THIS BELOW 1 IS DERIVED FROM createRekapanJS(currentMonthStokAlatData, rekapan[1] (the above rekapan))
    2: {
      "Company A": {
        currentBulanTotalSewaAlatAmount: {
          Alat1: 877,
          Alat2: 2000,
        },
        prevBulanTotalSewaAlatAmount: {},
        header: {
          Tanggal: { colIndex: 0 },
          Alat1: { colIndex: 1 },
          Alat2: { colIndex: 2 },
        },
        records: [],
      },
      "Company B": {
        currentBulanTotalSewaAlatAmount: {
          Alat3: 3000,
          Alat2: -789,
        },
        prevBulanTotalSewaAlatAmount: {},
        header: {
          Tanggal: { colIndex: 0 },
          Alat3: { colIndex: 1 },
          Alat2: { colIndex: 2 },
        },
        records: [],
      },
    },
  };

  const currentMonthStokAlatData = {
    0: [
      {
        tanggal: "25/01/2023",
        masuk: 0,
        keluar: 123,
        company_name: { name: "Company A" },
        alat_name: { name: "Alat1" },
      },
      {
        tanggal: "03/01/2023",
        masuk: 0,
        keluar: 789,
        company_name: { name: "Company B" },
        alat_name: { name: "Alat2" },
      },
    ] satisfies SupabaseWorksheetDataSchema,
    1: [
      {
        tanggal: "05/02/2023",
        masuk: 0,
        keluar: 5,
        company_name: { name: "Company A" },
        alat_name: { name: "Alat1" },
      },
      {
        tanggal: "12/02/2023",
        masuk: 0,
        keluar: 10,
        company_name: { name: "Company B" },
        alat_name: { name: "Alat2" },
      },
    ] satisfies SupabaseWorksheetDataSchema,
  };
  return { currentMonthStokAlatData, rekapan };
});

vi.mock("../../../pages/services/first-one/grid/io/uploadRekapanRemotely");
vi.mock("../../downloadExcelFile");
vi.mock("../convertRekapansJSToRekapanWorkbook", async (importOriginal) => {
  const original = await importOriginal<typeof ConvertRekapansModule>();
  return {
    ...original,
    convertRekapansJSToRekapanWorkbook: (
      rekapansJS: Parameters<typeof original.convertRekapansJSToRekapanWorkbook>[0],
      options?: Parameters<typeof original.convertRekapansJSToRekapanWorkbook>[1]
    ) => {
      return original.convertRekapansJSToRekapanWorkbook(rekapansJS, {
        ...options,
        applyStyles: false,
      });
    },
  };
});

const mockWaitForModalConfirmation = vi.fn(async () => {
  return {} as ClusteredCompanyNames;
});

describe("generateAllRekapans", () => {
  vi.spyOn(
    StandardizeStokAlatWorksheetTypoCompanyNamesModule,
    "standardizeStokAlatWorksheetTypoCompanyNames"
  ).mockImplementation(
    (_, currentMonthStokAlatData) => currentMonthStokAlatData
  );

  vi.spyOn(
    GetPrevMonthRekapanToUseModule,
    "getPrevMonthRekapanToUse"
  ).mockImplementation(async (rekapanToGetDate: Date) => {
    const month = rekapanToGetDate.getMonth();
    // @ts-ignore
    // TODO: Make it use mockReturnedValueOnce instead of indexing like this
    return rekapan[month];
  });

  vi.spyOn(
    GetCurrentMonthStokAlatDataModule,
    "getCurrentMonthStokAlatData"
  ).mockImplementation(async (currentMonthStokAlatToGetDate: Date) => {
    const month = currentMonthStokAlatToGetDate.getMonth();
    // @ts-ignore
    // TODO: Make it use mockReturnedValueOnce instead of indexing like this
    return currentMonthStokAlatData[month];
  });

  it("should generate all rekapans in between two dates", async () => {
    const startRekapanCreationDate = new Date("2023-01-31");
    const endRekapanCreationDate = new Date("2023-02-28");

    const result = await generateAllRekapans(
      startRekapanCreationDate,
      endRekapanCreationDate,
      mockWaitForModalConfirmation
    );

    const workbook = result[1];

    const workbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(workbook);

    const dirname = new URL(".", import.meta.url).pathname;

    const expectedExcelFilePath =
      "/generateAllRekapansMockData/excel-files/generateAllRekapans-test-1-out.xlsx";

    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: expectedExcelFilePath,
      }
    );

    expect(workbookFormatted).toEqual(expectedWorkbookFormatted);
  });
});
