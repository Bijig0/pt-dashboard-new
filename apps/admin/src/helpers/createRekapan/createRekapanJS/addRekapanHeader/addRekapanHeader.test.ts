import * as O from "fp-ts/lib/Option";
import { ReturnType } from "tsafe";
import { describe, expect, it } from "vitest";
import { RekapanWorkbookObj } from "../../../../hooks/useGetRekapanData";
import { RekapanWorkbookBody } from "../../types";
import { addRekapanHeader } from "./addRekapanHeader";

// Mock data for testing

describe("addRekapanHeader", () => {
  it(`sums the previous month's currentBulanTotalSewaAlatAmount and the current month's total record sum for each alat`, () => {
    const currentMonthRekapanWorkbookBody = {
      "Company A": {
        records: [
          {
            tanggal: "01/12/2023",
            stokDifference: -5,
            masuk: 0,
            keluar: 5,
            alatName: "Alat1",
            companyName: "Company A",
          },
        ],
      },
    } satisfies RekapanWorkbookBody;

    const prevMonthRekapan: O.Option<RekapanWorkbookObj> = O.some({
      "Company A": {
        header: {
          Tanggal: { colIndex: 0 },
          Alat1: { colIndex: 1 },
        },
        // Records for prevMonthRekapan should be inconsequentioal to the final result, only the currentBulanTotalSewaAlatAmounts is important
        records: [],
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {
          Alat1: 15,
        },
      },
    } satisfies RekapanWorkbookObj);

    const expectedOutput = {
      "Company A": {
        header: {
          Alat1: {
            rekapanMonth: 11,
            currentBulanTotalSewaAlatAmount: 10,
            prevBulanTotalSewaAlatAmount: 15,
            colIndex: 0,
            alatName: "Alat1",
          },
        },
        records: [
          {
            tanggal: "01/12/2023",
            stokDifference: -5,
            masuk: 0,
            keluar: 5,
            alatName: "Alat1",
            companyName: "Company A",
          },
        ],
      },
    } satisfies ReturnType<typeof addRekapanHeader>;

    const result = addRekapanHeader(
      currentMonthRekapanWorkbookBody,
      prevMonthRekapan
    );

    expect(result).toEqual(expectedOutput);
  });

  it("does not perform the multi-cascading if the alats are not properly present in the prevMonthRekapan", () => {
    const currentMonthRekapanWorkbookBody = {
      "Company A": {
        records: [
          {
            tanggal: "25/12/2023",
            masuk: 123,
            keluar: 0,
            companyName: "Company A",
            alatName: "Alat1",
            stokDifference: -123,
          },
        ],
      },
    } satisfies RekapanWorkbookBody;

    const prevMonthRekapan = {
      "Company A": {
        currentBulanTotalSewaAlatAmount: {
          Alat1: 1000,
          Alat2: 2000,
        },
        prevBulanTotalSewaAlatAmount: {},
        header: {
          // MUST BE PRESENT
          // Tanggal: { colIndex: 0 },
          // Alat1: { colIndex: 1 },
          // Alat2: { colIndex: 2 },
        },
        records: [],
      },
    } satisfies RekapanWorkbookObj;

    const expectedOutput = {
      "Company A": {
        header: {
          Alat1: {
            rekapanMonth: 11,
            currentBulanTotalSewaAlatAmount: 877,
            prevBulanTotalSewaAlatAmount: 1000,
            colIndex: 0,
            alatName: "Alat1",
          },
        },
        records: [
          {
            tanggal: "25/12/2023",
            masuk: 123,
            keluar: 0,
            companyName: "Company A",
            alatName: "Alat1",
            stokDifference: -123,
          },
        ],
      },
    } satisfies ReturnType<typeof addRekapanHeader>;

    const result = addRekapanHeader(
      currentMonthRekapanWorkbookBody,
      O.some(prevMonthRekapan)
    );

    expect(result).toEqual(expectedOutput);
  });

  it(`should handle multi-cascading alats, so for example if there's an alat from a prev month that isn't present
  in the current month, it shoud be added to the current month's rekapan without issue (in its header)`, () => {
    const currentMonthRekapanWorkbookBody = {
      "Company A": {
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
    } satisfies RekapanWorkbookBody;

    const prevMonthRekapan = O.some({
      "Company A": {
        header: {
          Tanggal: { colIndex: 0 },
          Alat2: { colIndex: 1 },
        },
        // Records should be inconsequentioal to the final result
        records: [],
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {
          Alat2: 10,
        },
      },
    } satisfies RekapanWorkbookObj);

    const expectedOutputWithPrevMonthEmpty = {
      "Company A": {
        header: {
          Alat1: {
            rekapanMonth: 11,
            currentBulanTotalSewaAlatAmount: -5,
            prevBulanTotalSewaAlatAmount: 0,
            colIndex: 1,
            alatName: "Alat1",
          },
          Alat2: {
            rekapanMonth: 11,
            currentBulanTotalSewaAlatAmount: 10,
            prevBulanTotalSewaAlatAmount: 10,
            colIndex: 0,
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
        ],
      },
    } satisfies ReturnType<typeof addRekapanHeader>;

    const result = addRekapanHeader(
      currentMonthRekapanWorkbookBody,
      prevMonthRekapan
    );

    expect(result).toEqual(expectedOutputWithPrevMonthEmpty);
  }),
    it(`should add headers with the alats being the sum of the currentBulanTotalSewaAlatAmount of the
  prevMonthRekapan and the sum of the currentMonthRekapanWorkbookBody stokDifference records`, () => {
      const currentMonthRekapanWorkbookBody = {
        "Company A": {
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
      } satisfies RekapanWorkbookBody;

      const prevMonthRekapan = O.some({
        "Company A": {
          header: {
            Tanggal: { colIndex: 0 },
            Alat1: { colIndex: 1 },
          },
          // Records should be inconsequentioal to the final result
          records: [],
          prevBulanTotalSewaAlatAmount: {},
          currentBulanTotalSewaAlatAmount: {
            Alat1: 10,
          },
        },
      } satisfies RekapanWorkbookObj);

      const expectedOutput = {
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
      } satisfies ReturnType<typeof addRekapanHeader>;

      const result = addRekapanHeader(
        currentMonthRekapanWorkbookBody,
        prevMonthRekapan
      );

      expect(result).toEqual(expectedOutput);
    }),
    it("should handle empty current month rekapan records", () => {
      // Unimplemented, right now it throws an error if records for currentMonthRekapanWorkbookBody is empty
      // but maybe it should just be empty
    });

  it(`should add headers with the prevBulanTotalSewaAlatAmount of the current month's rekapan being
    the currentBulanTotalSewaAlatAmount of the prevMonthRekapan
    `, () => {
    const currentMonthRekapanWorkbookBody = {
      "Company A": {
        records: [
          {
            tanggal: "01/12/2023",
            stokDifference: 0,
            masuk: 0,
            keluar: 0,
            alatName: "Alat1",
            companyName: "Company A",
          },
        ],
      },
    } satisfies RekapanWorkbookBody;

    const prevMonthRekapan = O.some({
      "Company A": {
        header: {
          Tanggal: { colIndex: 0 },
          Alat1: { colIndex: 1 },
        },
        // Records should be inconsequentioal to the final result
        records: [],
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {
          Alat1: 10,
        },
      },
    } satisfies RekapanWorkbookObj);

    const expectedOutputWithPrevMonthEmpty = {
      "Company A": {
        header: {
          Alat1: {
            rekapanMonth: 11,
            currentBulanTotalSewaAlatAmount: 10,
            prevBulanTotalSewaAlatAmount: 10,
            colIndex: 0,
            alatName: "Alat1",
          },
        },
        records: [
          {
            tanggal: "01/12/2023",
            stokDifference: 0,
            masuk: 0,
            keluar: 0,
            alatName: "Alat1",
            companyName: "Company A",
          },
        ],
      },
    } satisfies ReturnType<typeof addRekapanHeader>;

    const result = addRekapanHeader(
      currentMonthRekapanWorkbookBody,
      prevMonthRekapan
    );

    expect(result).toEqual(expectedOutputWithPrevMonthEmpty);
  }),
    it(`When given previous month rekapan with alats that are not present in current month,
     it adds them with zero stok difference and zero amounts, this is the cascade between rekapans`, () => {
      const currentMonthRekapanWorkbookBody = {
        "Company A": {
          records: [
            {
              tanggal: "01/12/2023",
              stokDifference: -5,
              masuk: 0,
              keluar: 5,
              alatName: "Alat1",
              companyName: "Company A",
            },
          ],
        },
      } satisfies RekapanWorkbookBody;

      const prevMonthRekapan = O.some({
        "Company A": {
          header: {
            Tanggal: { colIndex: 0 },
            Alat1: { colIndex: 1 },
            Alat2: { colIndex: 2 },
            Alat5: { colIndex: 3 },
          },
          records: [],
          prevBulanTotalSewaAlatAmount: {},
          currentBulanTotalSewaAlatAmount: {},
        },
      } satisfies RekapanWorkbookObj);

      const expectedOutputWithPrevMonthEmpty = {
        "Company A": {
          header: {
            Alat1: {
              rekapanMonth: 11,
              currentBulanTotalSewaAlatAmount: -5,
              prevBulanTotalSewaAlatAmount: 0,
              colIndex: 0,
              alatName: "Alat1",
            },
            Alat2: {
              alatName: "Alat2",
              colIndex: 1,
              currentBulanTotalSewaAlatAmount: 0,
              prevBulanTotalSewaAlatAmount: 0,
              rekapanMonth: 11,
            },
            Alat5: {
              alatName: "Alat5",
              colIndex: 2,
              currentBulanTotalSewaAlatAmount: 0,
              prevBulanTotalSewaAlatAmount: 0,
              rekapanMonth: 11,
            },
          },
          records: [
            {
              tanggal: "01/12/2023",
              stokDifference: -5,
              masuk: 0,
              keluar: 5,
              alatName: "Alat1",
              companyName: "Company A",
            },
          ],
        },
      } satisfies ReturnType<typeof addRekapanHeader>;

      const result = addRekapanHeader(
        currentMonthRekapanWorkbookBody,
        prevMonthRekapan
      );

      expect(result).toEqual(expectedOutputWithPrevMonthEmpty);
    });

  it("adds headers correctly when previous month data is not provided", () => {
    const currentMonthRekapanWorkbookBody = {
      "Company A": {
        records: [
          {
            tanggal: "01/12/2023",
            stokDifference: -5,
            masuk: 0,
            keluar: 5,
            alatName: "Alat1",
            companyName: "Company A",
          },
        ],
      },
    } satisfies RekapanWorkbookBody;

    const expectedOutputWithoutPrevMonth = {
      "Company A": {
        header: {
          Alat1: {
            rekapanMonth: 11,
            currentBulanTotalSewaAlatAmount: -5,
            prevBulanTotalSewaAlatAmount: 0,
            colIndex: 0,
            alatName: "Alat1",
          },
        },
        records: [
          {
            tanggal: "01/12/2023",
            stokDifference: -5,
            masuk: 0,
            keluar: 5,
            alatName: "Alat1",
            companyName: "Company A",
          },
        ],
      },
    } satisfies ReturnType<typeof addRekapanHeader>;

    const result = addRekapanHeader(currentMonthRekapanWorkbookBody, O.none);
    expect(result).toEqual(expectedOutputWithoutPrevMonth);
  });
});
