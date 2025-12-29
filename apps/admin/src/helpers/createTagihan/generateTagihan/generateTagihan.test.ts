import dayjsUtc from "@dayjsutc";
import * as ExcelJS from "exceljs";
import { vi } from "vitest";
import { convertExcelFileToWorkbookFormatted } from "../../convertExcelFileToWorkbookFormatted";
import { convertExcelJSWorkbookToWorkbookFormatted } from "../../convertExcelJSWorkbookToWorkbookFormatted/convertExcelJSWorkbookToWorkbookFormatted";
import generateTagihan, { Input } from "./generateTagihan";

vi.mock("../../downloadExcelFile");

const expectWorkbooksToBeEqual = async (
  workbook1: ExcelJS.Workbook,
  workbook2: ExcelJS.Workbook
) => {
  const workbook1AsWorkbookFormatted =
    await convertExcelJSWorkbookToWorkbookFormatted(workbook1);

  const workbook2AsWorkbookFormatted =
    await convertExcelJSWorkbookToWorkbookFormatted(workbook2);

  expect(workbook1AsWorkbookFormatted).toEqual(workbook2AsWorkbookFormatted);
};

/**
 * Scnearios:
 * 1. Single Record for a single month
 * 2. Multiple records
 * 3. The negatives
 * 4. The first date amount if present shit
 * 6. What happens if you have a negative record, but the initial amount is negative, so you end up with a negative total, does the 1BL still come into play
 *
 *
 */

describe("generateTagihan", () => {
  it("should generate a single from date until end of month record for single positive record", async () => {
    const mockData = [
      {
        tanggal: "Total Sewa Periode December",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 0,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 0,
            hargaBulanan: 25,
            hargaHarian: 0.81,
          },
        ],
      },
      {
        tanggal: "09/01/2024",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 10,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 20,
            hargaBulanan: 25,
            hargaHarian: 0.81,
          },
        ],
      },
      {
        tanggal: "Total Sewa Periode January",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 10,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 20,
            hargaBulanan: 25,
            hargaHarian: 0.81,
          },
        ],
      },
    ] satisfies Input;

    const periodToCreateTagihanFor = dayjsUtc("2024-01-15");

    const result = generateTagihan({
      rekapanData: mockData,
      periodToCreateTagihanFor,
    });

    console.log({ result });

    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);

    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath =
      "/mockData/excel-files/generateTagihan-single-record.xlsx";

    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedFilePath,
      }
    );

    expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
    expect(expectedWorkbookFormatted).toMatchSnapshot();
  });

  it("should generate the negative records from start of month until selected date", async () => {
    const mockData = [
      {
        tanggal: "Total Sewa Periode December",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 100,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
        ],
      },
      {
        tanggal: "09/01/2024",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: -10,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
        ],
      },
      {
        tanggal: "Total Sewa Periode January",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 90,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
        ],
      },
    ] satisfies Input;

    const periodToCreateTagihanFor = dayjsUtc("2024-01-15");

    const result = generateTagihan({
      rekapanData: mockData,
      periodToCreateTagihanFor,
    });

    console.log({ result });

    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);

    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath =
      "/mockData/excel-files/generateTagihan-single-negative-record.xlsx";

    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedFilePath,
      }
    );

    expect(expectedWorkbookFormatted).toEqual(resultAsWorkbookFormatted);
  });

  it(`should generate the from selected date until end of month positive record
        and negative from start of month until selected date, so a mix here `, async () => {
    const mockData = [
      {
        tanggal: "Total Sewa Periode December",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 100,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 150,
            hargaBulanan: 25,
            hargaHarian: 0.81,
          },
        ],
      },
      {
        tanggal: "09/01/2024",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: -10,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 20,
            hargaBulanan: 25,
            hargaHarian: 0.81,
          },
        ],
      },
      {
        tanggal: "11/01/2024",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 50,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: -40,
            hargaBulanan: 25,
            hargaHarian: 0.81,
          },
        ],
      },

      {
        tanggal: "Total Sewa Periode January",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 140,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 130,
            hargaBulanan: 25,
            hargaHarian: 0.81,
          },
        ],
      },
    ] satisfies Input;

    const periodToCreateTagihanFor = dayjsUtc("2024-01-15");

    const result = generateTagihan({
      rekapanData: mockData,
      periodToCreateTagihanFor,
    });

    console.log({ result });

    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);

    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath =
      "/mockData/excel-files/generateTagihan-positive-and-negative-records.xlsx";

    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedFilePath,
      }
    );

    expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
    expect(expectedWorkbookFormatted).toMatchSnapshot();
  });

  it(`should coalesce the first date amount into the bulanan`, async () => {
    const mockData = [
      {
        tanggal: "Total Sewa Periode December",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 100,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
        ],
      },
      {
        tanggal: "01/01/2024",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 10,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
        ],
      },
      {
        tanggal: "Total Sewa Periode January",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 110,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
        ],
      },
    ] satisfies Input;

    const periodToCreateTagihanFor = dayjsUtc("2024-01-15");

    const result = generateTagihan({
      rekapanData: mockData,
      periodToCreateTagihanFor,
    });

    console.log({ result });

    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);

    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath =
      "/mockData/excel-files/generateTagihan-coalesce-first-date-amount.xlsx";

    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedFilePath,
      }
    );

    expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
    expect(expectedWorkbookFormatted).toMatchSnapshot();
  });

  it("should generate multiple 1BL records if you have a negative at the end of the month and a normal 1BL month", async () => {
    const mockData = [
      {
        tanggal: "Total Sewa Periode December",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 100,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
        ],
      },
      {
        tanggal: "31/01/2024",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: -50,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
        ],
      },

      {
        tanggal: "Total Sewa Periode January",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 50,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
        ],
      },
    ] satisfies Input;

    const periodToCreateTagihanFor = dayjsUtc("2024-01-15");

    const result = generateTagihan({
      rekapanData: mockData,
      periodToCreateTagihanFor,
    });

    console.log({ result });

    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);

    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath =
      "/mockData/excel-files/generateTagihan-multiple-1BL-records.xlsx";

    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedFilePath,
      }
    );

    expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
    expect(expectedWorkbookFormatted).toMatchSnapshot();
  });

  it("should generate multiple dates until end of month records for multiple positive records", async () => {
    const mockData = [
      {
        tanggal: "Total Sewa Periode December",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 100,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 200,
            hargaBulanan: 25,
            hargaHarian: 0.81,
          },
        ],
      },
      {
        tanggal: "09/01/2024",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 10,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 20,
            hargaBulanan: 25,
            hargaHarian: 0.81,
          },
        ],
      },
      {
        tanggal: "11/01/2024",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 30,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 40,
            hargaBulanan: 25,
            hargaHarian: 0.81,
          },
        ],
      },
      {
        tanggal: "Total Sewa Periode January",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 140,
            hargaBulanan: 15,
            hargaHarian: 0.48,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 260,
            hargaBulanan: 25,
            hargaHarian: 0.81,
          },
        ],
      },
    ] satisfies Input;
    const periodToCreateTagihanFor = dayjsUtc("2024-01-15");
    const result = generateTagihan({
      rekapanData: mockData,
      periodToCreateTagihanFor,
    });
    console.log({ result });
    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);
    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath =
      "/mockData/excel-files/generateTagihan-multiple-positive-records.xlsx";
    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedFilePath,
      }
    );
    expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
    expect(expectedWorkbookFormatted).toMatchSnapshot();
  });

  it.todo(
    "should create the 1bl record for full amount if there is only sisa alats"
  );

  it(`should create the 1bl records given a mixed rekapan where there are gaps
  for one of the alats, and filled in dates for the other alats
  `, async () => {
    const mockData = [
      {
        tanggal: "Sisa Alat",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 10,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 20,
            hargaBulanan: 300,
            hargaHarian: 10,
          },
        ],
      },
      {
        tanggal: "12/01/2024",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 5,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
        ],
      },
      {
        tanggal: "Sisa Alat",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 15,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 20,
            hargaBulanan: 300,
            hargaHarian: 10,
          },
        ],
      },
    ] satisfies Input as Input;

    const periodToCreateTagihanFor = dayjsUtc("2024-01-15");
    const result = generateTagihan({
      rekapanData: mockData,
      periodToCreateTagihanFor,
    });
    console.log({ result });
    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(result);
    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath =
      "/mockData/excel-files/generateTagihan-alats-with-intermittent-borrowing-mixed-with-alats-without.xlsx";
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

// TODO: Below are test cases for features that should be implemented, but are uncommon and I don't even know how to approach, so its chill for now

// it("should generate multiple dates until end of month records for multiple positive records where the initial jumlah alat is 0", async () => {
//   throw new Error("Not implemented");
//   const mockData = [
//     {
//       tanggal: "Total Sewa Periode December",
//       alatRecords: [
//         {
//           alatName: "Alat 1",
//           jumlahAlat: 0,
//           hargaBulanan: 15,
//           hargaHarian: 0.48,
//         },
//         {
//           alatName: "Alat 2",
//           jumlahAlat: 0,
//           hargaBulanan: 25,
//           hargaHarian: 0.81,
//         },
//       ],
//     },
//     {
//       tanggal: "09/01/2024",
//       alatRecords: [
//         {
//           alatName: "Alat 1",
//           jumlahAlat: 10,
//           hargaBulanan: 15,
//           hargaHarian: 0.48,
//         },
//         {
//           alatName: "Alat 2",
//           jumlahAlat: 20,
//           hargaBulanan: 25,
//           hargaHarian: 0.81,
//         },
//       ],
//     },
//     {
//       tanggal: "11/01/2024",
//       alatRecords: [
//         {
//           alatName: "Alat 1",
//           jumlahAlat: 10,
//           hargaBulanan: 15,
//           hargaHarian: 0.48,
//         },
//         {
//           alatName: "Alat 2",
//           jumlahAlat: 20,
//           hargaBulanan: 25,
//           hargaHarian: 0.81,
//         },
//       ],
//     },

//     {
//       tanggal: "Total Sewa Periode January",
//       alatRecords: [
//         {
//           alatName: "Alat 1",
//           jumlahAlat: 10,
//           hargaBulanan: 15,
//           hargaHarian: 0.48,
//         },
//         {
//           alatName: "Alat 2",
//           jumlahAlat: 20,
//           hargaBulanan: 25,
//           hargaHarian: 0.81,
//         },
//       ],
//     },
//   ] satisfies Input;

//   const periodToCreateTagihanFor = dayjsUtc("2024-01-15");

//   const result = generateTagihan({
//     rekapanData: mockData,
//     periodToCreateTagihanFor,
//   });

//   console.log({ result });

//   const resultAsWorkbookFormatted =
//     await convertExcelJSWorkbookToWorkbookFormatted(result);

//   const dirname = new URL(".", import.meta.url).pathname;
//   const excelExpectedFilePath =
//     "/mockData/excel-files/generateTagihan-multiple-positive-records.xlsx";

//   const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
//     {
//       dirname,
//       path: excelExpectedFilePath,
//     }
//   );

//   expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
//   throw new Error("Wrong expected");
// });

// it("should generate a normal 1BL record if given a prev bulan total sewa alat positive amount", async () => {
//   const mockData = [
//     {
//       tanggal: "Total Sewa Periode December",
//       alatRecords: [{ alatName: "Alat 1", jumlahAlat: 100, harga: 15 }],
//     },
//     {
//       tanggal: "Total Sewa Periode January",
//       alatRecords: [{ alatName: "Alat 1", jumlahAlat: 10, harga: 15 }],
//     },
//   ] satisfies Input;

//   // const periodToCreateTagihanFor = dayjsUtc("2024-01-15");

//   // const result = generateTagihan({
//   //   rekapanData: mockData,
//   //   periodToCreateTagihanFor,
//   // });

//   // console.log({ result });

//   // const resultAsWorkbookFormatted =
//   //   await convertExcelJSWorkbookToWorkbookFormatted(result);

//   // const dirname = new URL(".", import.meta.url).pathname;
//   // const excelExpectedFilePath =
//   //   "/mockData/excel-files/generateTagihan-normal-1BL-record.xlsx";

//   // const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
//   //   {
//   //     dirname,
//   //     path: excelExpectedFilePath,
//   //   }
//   // );

//   // expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);

//   throw new Error(
//     "Not implemented, this will fail if you run it regularly, feature actually not implemented yet"
//   );
// });
