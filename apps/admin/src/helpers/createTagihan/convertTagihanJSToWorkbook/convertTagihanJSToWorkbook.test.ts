import { convertExcelFileToWorkbookFormatted } from "../../convertExcelFileToWorkbookFormatted";
import { convertExcelJSWorkbookToWorkbookFormatted } from "../../convertExcelJSWorkbookToWorkbookFormatted/convertExcelJSWorkbookToWorkbookFormatted";
import { TagihanJS } from "../types";
import { convertTagihanJSToWorkbook } from "./convertTagihanJSToWorkbook";

// Scenarios
/**
 * 1. Multiple records per Alat
 * 2. Single record
 * 3. Multiple Alats
 * 4. Alats with single records
 * 5. Negative Alats with start date to end date instead of start date to end of month
 * 6. Total after PPN is the subtracted amount of total minus PPN
 */

describe("generateTagihanBulananTotals", () => {
  it("should generate correct tagihan for multiple alats with multiple records each", async () => {
    const mockData = {
      data: {
        Alat1: {
          records: [
            {
              tanggalRange: {
                start: "01/07/2024",
                end: "10/07/2024",
              },
              days: 10,
              jumlah: 2,
              totalSubtotal: 4000,
            },
            {
              tanggalRange: {
                start: "15/07/2024",
                end: "25/07/2024",
              },
              days: 11,
              jumlah: 1,
              totalSubtotal: 2200,
            },
            {
              tanggalRange: {
                start: "28/07/2024",
                end: "31/07/2024",
              },
              days: 4,
              jumlah: 3,
              totalSubtotal: 2400,
            },
          ],
          hargaBulanan: 200,
          hargaHarian: 6.45,
          recordsSubtotal: 8600,
        },
        Alat2: {
          records: [
            {
              tanggalRange: {
                start: "03/07/2024",
                end: "14/07/2024",
              },
              days: 12,
              jumlah: 1,
              totalSubtotal: 3600,
            },
            {
              tanggalRange: {
                start: "18/07/2024",
                end: "31/07/2024",
              },
              days: 14,
              jumlah: 2,
              totalSubtotal: 8400,
            },
          ],
          hargaBulanan: 300,
          hargaHarian: 9.68,
          recordsSubtotal: 12000,
        },
      },
      total: 20600,
      ppn: 2060,
      totalAfterPPN: 18660,
    } satisfies TagihanJS;

    const result = convertTagihanJSToWorkbook(mockData);

    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);

    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath =
      "/mockData/excel-files/convertTagihanJSToWorkbook-multiple-alats-multiple-records-each.xlsx";

    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedFilePath,
      }
    );

    expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
    expect(expectedWorkbookFormatted).toMatchSnapshot();
  });

  it("should generate correct tagihan for multiple alats with single record each", async () => {
    const mockData = {
      data: {
        Alat1: {
          records: [
            {
              tanggalRange: {
                start: "01/07/2024",
                end: "31/07/2024",
              },
              days: 31,
              jumlah: 1,
              totalSubtotal: 13950,
            },
          ],
          hargaBulanan: 450,
          hargaHarian: 15,
          recordsSubtotal: 13950,
        },
        Alat2: {
          records: [
            {
              tanggalRange: {
                start: "05/07/2024",
                end: "31/07/2024",
              },
              days: 27,
              jumlah: 2,
              totalSubtotal: 8640,
            },
          ],
          hargaBulanan: 160,
          hargaHarian: 5.16,
          recordsSubtotal: 8640,
        },
      },
      total: 22590,
      ppn: 100,
      totalAfterPPN: 22490,
    } satisfies TagihanJS;

    const result = convertTagihanJSToWorkbook(mockData);

    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);

    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath =
      "/mockData/excel-files/convertTagihanJSToWorkbook-multiple-alats-single-record-each.xlsx";

    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedFilePath,
      }
    );

    expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
    expect(expectedWorkbookFormatted).toMatchSnapshot();
  });

  it("should generate correct tagihan for one record for one alat", async () => {
    const mockData = {
      data: {
        Alat1: {
          records: [
            {
              tanggalRange: {
                start: "01/07/2024",
                end: "31/07/2024",
              },
              days: 31,
              jumlah: 2,
              totalSubtotal: 6200,
            },
          ],
          hargaBulanan: 100,
          hargaHarian: 3.33,
          recordsSubtotal: 6200,
        },
      },
      total: 6200,
      ppn: 100,
      totalAfterPPN: 6000,
    } satisfies TagihanJS;

    const result = convertTagihanJSToWorkbook(mockData);

    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);

    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath =
      "/mockData/excel-files/convertTagihanJSToWorkbook-one-record-one-alat.xlsx";

    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedFilePath,
      }
    );

    expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
  });

  it("should generate correct tagihan for multiple records for one alat", async () => {
    const mockData = {
      data: {
        Alat1: {
          records: [
            {
              tanggalRange: {
                start: "01/07/2024",
                end: "31/07/2024",
              },
              days: 31,
              jumlah: 2,
              totalSubtotal: 6200,
            },
            {
              tanggalRange: {
                start: "10/07/2024",
                end: "31/07/2024",
              },
              days: 22,
              jumlah: 2,
              totalSubtotal: 4400,
            },
          ],
          hargaBulanan: 100,
          hargaHarian: 3.23,
          recordsSubtotal: 10600,
        },
      },
      total: 10600,
      ppn: 100,
      totalAfterPPN: 10500,
    } satisfies TagihanJS;

    const result = convertTagihanJSToWorkbook(mockData);

    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);

    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath =
      "/mockData/excel-files/convertTagihanJSToWorkbook-multiple-records-one-alat.xlsx";

    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedFilePath,
      }
    );

    expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
    expect(expectedWorkbookFormatted).toMatchSnapshot();
  });
});
