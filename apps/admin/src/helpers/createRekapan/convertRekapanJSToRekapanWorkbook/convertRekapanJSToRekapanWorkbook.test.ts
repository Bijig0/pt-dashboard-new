import { convertExcelFileToWorkbookFormatted } from "../../../../src/helpers/convertExcelFileToWorkbookFormatted";
import { convertExcelJSWorkbookToWorkbookFormatted } from "../../convertExcelJSWorkbookToWorkbookFormatted/convertExcelJSWorkbookToWorkbookFormatted";
import { RekapanWorkbook } from "../types";
import { convertRekapanJSToRekapanWorkbook } from "./convertRekapanJSToRekapanWorkbook";

describe("convertRekapanJSToRekapanWorkbook", () => {
  it("writes the records for a single company to a single worksheet", async () => {
    const mockData = {
      "Company A": {
        header: {
          Alat1: {
            rekapanMonth: 11,
            currentBulanTotalSewaAlatAmount: 5,
            prevBulanTotalSewaAlatAmount: 10,
            colIndex: 0,
            alatName: "Alat1",
          },
        },
        records: [
          {
            tanggal: "01/12/2023",
            stokDifference: -5,
            masuk: 5,
            keluar: 0,
            alatName: "Alat1",
            companyName: "Company A",
          },
        ],
      },
    } satisfies RekapanWorkbook;
    const result = convertRekapanJSToRekapanWorkbook(mockData);

    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);

    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath =
      "/mockData/excel-files/convertRekapanJSToRekapanWorkbook-test-1-out.xlsx";

    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedFilePath,
      }
    );

    expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
  });

  it("writes the records for multiple companies to a multiple worksheets", async () => {
    const mockData = {
      "Company A": {
        header: {
          Alat1: {
            rekapanMonth: 11,
            currentBulanTotalSewaAlatAmount: 5,
            prevBulanTotalSewaAlatAmount: 10,
            colIndex: 0,
            alatName: "Alat1",
          },
        },
        records: [
          {
            tanggal: "01/12/2023",
            stokDifference: -5,
            masuk: 5,
            keluar: 0,
            alatName: "Alat1",
            companyName: "Company A",
          },
        ],
      },
      "Company B": {
        header: {
          Alat1: {
            rekapanMonth: 11,
            currentBulanTotalSewaAlatAmount: -90,
            prevBulanTotalSewaAlatAmount: 10,
            colIndex: 0,
            alatName: "Alat1",
          },
        },
        records: [
          {
            tanggal: "05/12/2023",
            stokDifference: -100,
            masuk: 100,
            keluar: 0,
            alatName: "Alat1",
            companyName: "Company A",
          },
        ],
      },
    } satisfies RekapanWorkbook;
    const result = convertRekapanJSToRekapanWorkbook(mockData);

    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);

    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath =
      "/mockData/excel-files/convertRekapanJSToRekapanWorkbook-test-2-out.xlsx";

    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedFilePath,
      }
    );

    expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
  });

  it("merges records with same date but different alats into one row", () => {
    const mockData = {
      "Company A": {
        header: {
          Alat1: {
            rekapanMonth: 11,
            currentBulanTotalSewaAlatAmount: 12,
            prevBulanTotalSewaAlatAmount: 10,
            colIndex: 0,
            alatName: "Alat1",
          },
          Alat2: {
            rekapanMonth: 11,
            currentBulanTotalSewaAlatAmount: 7,
            prevBulanTotalSewaAlatAmount: 0,
            colIndex: 1,
            alatName: "Alat2",
          },
        },
        records: [
          {
            tanggal: "01/12/2023",
            stokDifference: -5,
            masuk: 5,
            keluar: 0,
            alatName: "Alat1",
            companyName: "Company A",
          },
          {
            tanggal: "01/12/2023",
            stokDifference: -7,
            masuk: 7,
            keluar: 0,
            alatName: "Alat2",
            companyName: "Company A",
          },
        ],
      },
    } satisfies RekapanWorkbook;

    const result = convertRekapanJSToRekapanWorkbook(mockData);
    const ws = result.getWorksheet("Company A")!;

    // Get all rows as values
    const rows = ws.getSheetValues();

    // Find rows with "01/12/2023" date - should only be 1 merged row
    const recordRows = rows.filter(
      (row) => Array.isArray(row) && row[1] === "01/12/2023"
    );
    expect(recordRows.length).toBe(1);

    // The merged row should have both Alat1 and Alat2 values
    const mergedRow = recordRows[0] as (string | number | null)[];
    expect(mergedRow[1]).toBe("01/12/2023"); // Tanggal
    expect(mergedRow[2]).toBe(-5); // Alat1
    expect(mergedRow[3]).toBe(-7); // Alat2
  });

  it("creates separate rows for same alat on same date (collision)", () => {
    const mockData = {
      "Company A": {
        header: {
          Alat1: {
            rekapanMonth: 11,
            currentBulanTotalSewaAlatAmount: 8,
            prevBulanTotalSewaAlatAmount: 10,
            colIndex: 0,
            alatName: "Alat1",
          },
        },
        records: [
          {
            tanggal: "01/12/2023",
            stokDifference: -5,
            masuk: 5,
            keluar: 0,
            alatName: "Alat1",
            companyName: "Company A",
          },
          {
            tanggal: "01/12/2023",
            stokDifference: -3,
            masuk: 3,
            keluar: 0,
            alatName: "Alat1",
            companyName: "Company A",
          },
        ],
      },
    } satisfies RekapanWorkbook;

    const result = convertRekapanJSToRekapanWorkbook(mockData);
    const ws = result.getWorksheet("Company A")!;

    // Get all rows as values
    const rows = ws.getSheetValues();

    // Find rows with "01/12/2023" date - should be 2 separate rows
    const recordRows = rows.filter(
      (row) => Array.isArray(row) && row[1] === "01/12/2023"
    );
    expect(recordRows.length).toBe(2);

    // First row should have Alat1 = -5
    const row1 = recordRows[0] as (string | number | null)[];
    expect(row1[2]).toBe(-5);

    // Second row should have Alat1 = -3
    const row2 = recordRows[1] as (string | number | null)[];
    expect(row2[2]).toBe(-3);
  });
});
