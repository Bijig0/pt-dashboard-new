import { RekapanWorkbookObj } from "../../../../hooks/useGetRekapanData";
import { RekapanWorkbookBody } from "../../types";
import { addUnusedPrevMonthRekapanCompanyNames } from "./addUnusedPrevMonthRekapanCompanyNames";

describe("addUnusedPrevMonthRekapanCompanyNames", () => {
  it("should add companies from previous month that are not in current month", () => {
    const prevMonthRekapan: RekapanWorkbookObj = {
      "Company A": {
        prevBulanTotalSewaAlatAmount: { Alat1: 1000, Alat2: 2000 },
        currentBulanTotalSewaAlatAmount: { Alat1: 1500, Alat2: 2500 },
        header: { Tanggal: { colIndex: 0 }, Alat: { colIndex: 1 } },
        records: [{ tanggal: "01/07/2023", alat: "Alat1", jumlah: 5 }],
      },
      "Company B": {
        prevBulanTotalSewaAlatAmount: { Alat3: 3000 },
        currentBulanTotalSewaAlatAmount: { Alat3: 3500 },
        header: { Tanggal: { colIndex: 0 }, Alat: { colIndex: 1 } },
        records: [{ tanggal: "01/07/2023", alat: "Alat3", jumlah: 3 }],
      },
    };
    const currentMonthRekapanBody: RekapanWorkbookBody = {
      "Company B": { records: [] },
      "Company C": { records: [] },
    };

    const result = addUnusedPrevMonthRekapanCompanyNames(
      prevMonthRekapan,
      currentMonthRekapanBody
    );

    expect(result).toEqual({
      "Company A": { records: [] },
      "Company B": { records: [] },
      "Company C": { records: [] },
    });
  });

  it("should not modify current month data for existing companies", () => {
    const prevMonthRekapan: RekapanWorkbookObj = {
      "Company A": {
        prevBulanTotalSewaAlatAmount: { Alat1: 1000 },
        currentBulanTotalSewaAlatAmount: { Alat1: 1500 },
        header: { Tanggal: { colIndex: 0 }, Alat: { colIndex: 1 } },
        records: [{ tanggal: "01/07/2023", alat: "Alat1", jumlah: 5 }],
      },
      "Company B": {
        prevBulanTotalSewaAlatAmount: { Alat2: 2000 },
        currentBulanTotalSewaAlatAmount: { Alat2: 2500 },
        header: { Tanggal: { colIndex: 0 }, Alat: { colIndex: 1 } },
        records: [{ tanggal: "01/07/2023", alat: "Alat2", jumlah: 3 }],
      },
    };
    const currentMonthRekapanBody: RekapanWorkbookBody = {
      "Company B": {
        records: [
          {
            tanggal: "01/07/2023",
            stokDifference: 5,
            masuk: 10,
            keluar: 5,
            alatName: "Alat1",
            companyName: "Company B",
          },
        ],
      },
    };

    const result = addUnusedPrevMonthRekapanCompanyNames(
      prevMonthRekapan,
      currentMonthRekapanBody
    );

    expect(result).toEqual({
      "Company A": { records: [] },
      "Company B": {
        records: [
          {
            tanggal: "01/07/2023",
            stokDifference: 5,
            masuk: 10,
            keluar: 5,
            alatName: "Alat1",
            companyName: "Company B",
          },
        ],
      },
    });
  });

  it("should return current month data unchanged if all companies are present", () => {
    const prevMonthRekapan: RekapanWorkbookObj = {
      "Company A": {
        prevBulanTotalSewaAlatAmount: { Alat1: 1000 },
        currentBulanTotalSewaAlatAmount: { Alat1: 1500 },
        header: { Tanggal: { colIndex: 0 }, Alat: { colIndex: 1 } },
        records: [{ tanggal: "01/07/2023", alat: "Alat1", jumlah: 5 }],
      },
      "Company B": {
        prevBulanTotalSewaAlatAmount: { Alat2: 2000 },
        currentBulanTotalSewaAlatAmount: { Alat2: 2500 },
        header: { Tanggal: { colIndex: 0 }, Alat: { colIndex: 1 } },
        records: [{ tanggal: "01/07/2023", alat: "Alat2", jumlah: 3 }],
      },
    };
    const currentMonthRekapanBody: RekapanWorkbookBody = {
      "Company A": { records: [] },
      "Company B": { records: [] },
    };

    const result = addUnusedPrevMonthRekapanCompanyNames(
      prevMonthRekapan,
      currentMonthRekapanBody
    );

    expect(result).toEqual(currentMonthRekapanBody);
  });

  it("should handle empty previous month rekapan", () => {
    const prevMonthRekapan: RekapanWorkbookObj = {};
    const currentMonthRekapanBody: RekapanWorkbookBody = {
      "Company A": { records: [] },
    };

    const result = addUnusedPrevMonthRekapanCompanyNames(
      prevMonthRekapan,
      currentMonthRekapanBody
    );

    expect(result).toEqual(currentMonthRekapanBody);
  });

  it("should handle empty current month rekapan body", () => {
    const prevMonthRekapan: RekapanWorkbookObj = {
      "Company A": {
        prevBulanTotalSewaAlatAmount: { Alat1: 1000 },
        currentBulanTotalSewaAlatAmount: { Alat1: 1500 },
        header: { Tanggal: { colIndex: 0 }, Alat: { colIndex: 1 } },
        records: [{ tanggal: "01/07/2023", alat: "Alat1", jumlah: 5 }],
      },
    };
    const currentMonthRekapanBody: RekapanWorkbookBody = {};

    const result = addUnusedPrevMonthRekapanCompanyNames(
      prevMonthRekapan,
      currentMonthRekapanBody
    );

    expect(result).toEqual({
      "Company A": { records: [] },
    });
  });
});
