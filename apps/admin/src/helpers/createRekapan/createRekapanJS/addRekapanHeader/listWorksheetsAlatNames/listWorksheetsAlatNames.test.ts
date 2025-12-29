import { RekapanWorkbookObj } from "../../../../../hooks/useGetRekapanData";
import { RekapanWorkbookBody } from "../../../types";
import { listWorksheetsAlatNames } from "./listWorksheetsAlatNames";

describe("listWorksheetsAlatNames", () => {
  const mockCurrentMonthWorksheets: RekapanWorkbookBody = {
    "Company A": {
      records: [
        {
          tanggal: "01/07/2023",
          stokDifference: 5,
          masuk: 10,
          keluar: 5,
          alatName: "Alat1",
          companyName: "Company A",
        },
        {
          tanggal: "01/07/2023",
          stokDifference: 3,
          masuk: 8,
          keluar: 5,
          alatName: "Alat2",
          companyName: "Company A",
        },
        {
          tanggal: "02/07/2023",
          stokDifference: 2,
          masuk: 7,
          keluar: 5,
          alatName: "Alat1",
          companyName: "Company A",
        },
        {
          tanggal: "02/07/2023",
          stokDifference: 4,
          masuk: 9,
          keluar: 5,
          alatName: "Alat3",
          companyName: "Company A",
        },
      ],
    },
    "Company B": {
      records: [
        {
          tanggal: "01/07/2023",
          stokDifference: 1,
          masuk: 6,
          keluar: 5,
          alatName: "Alat4",
          companyName: "Company B",
        },
      ],
    },
  };

  const mockPrevMonthRekapan: RekapanWorkbookObj = {
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
    "Company C": {
      header: { Tanggal: { colIndex: 0 }, Alat6: { colIndex: 1 } },
      records: [],
      prevBulanTotalSewaAlatAmount: {},
      currentBulanTotalSewaAlatAmount: {},
    },
  };

  it("should combine alat names from current and previous month", () => {
    const result = listWorksheetsAlatNames(
      mockCurrentMonthWorksheets,
      mockPrevMonthRekapan
    );

    expect(result).toEqual({
      "Company A": ["Alat1", "Alat2", "Alat5", "Alat3"],
      "Company B": ["Alat4"],
      "Company C": ["Alat6"],
    });
  });

  it("should handle empty current month worksheets", () => {
    const result = listWorksheetsAlatNames({}, mockPrevMonthRekapan);

    expect(result).toEqual({
      "Company A": ["Alat1", "Alat2", "Alat5"],
      "Company C": ["Alat6"],
    });
  });

  it("should handle empty previous month rekapan", () => {
    const result = listWorksheetsAlatNames(mockCurrentMonthWorksheets, {});

    expect(result).toEqual({
      "Company A": ["Alat1", "Alat2", "Alat3"],
      "Company B": ["Alat4"],
    });
  });

  it("should handle both empty current and previous month data", () => {
    const result = listWorksheetsAlatNames({}, {});

    expect(result).toEqual({});
  });

  it("should remove duplicate alat names", () => {
    const currentMonthWithDuplicates: RekapanWorkbookBody = {
      "Company A": {
        records: [
          {
            tanggal: "01/07/2023",
            stokDifference: 5,
            masuk: 10,
            keluar: 5,
            alatName: "Alat1",
            companyName: "Company A",
          },
          {
            tanggal: "01/07/2023",
            stokDifference: 3,
            masuk: 8,
            keluar: 5,
            alatName: "Alat1",
            companyName: "Company A",
          },
          {
            tanggal: "01/07/2023",
            stokDifference: 2,
            masuk: 7,
            keluar: 5,
            alatName: "Alat2",
            companyName: "Company A",
          },
        ],
      },
    };

    const result = listWorksheetsAlatNames(
      currentMonthWithDuplicates,
      mockPrevMonthRekapan
    );

    expect(result).toEqual({
      "Company A": ["Alat1", "Alat2", "Alat5"],
      "Company C": ["Alat6"],
    });
  });

  it("should handle companies present only in current month", () => {
    const result = listWorksheetsAlatNames(mockCurrentMonthWorksheets, {});

    expect(result).toEqual({
      "Company A": ["Alat1", "Alat2", "Alat3"],
      "Company B": ["Alat4"],
    });
  });

  it("should handle companies present only in previous month", () => {
    const result = listWorksheetsAlatNames({}, mockPrevMonthRekapan);

    expect(result).toEqual({
      "Company A": ["Alat1", "Alat2", "Alat5"],
      "Company C": ["Alat6"],
    });
  });

  it("should preserve alat names from previous month when company has empty records in current month (carried over scenario)", () => {
    // This is what happens when addUnusedPrevMonthRekapanCompanyNames adds a company:
    // It creates an entry with { records: [] } for companies in prev month but not current
    const currentMonthWithEmptyRecordsCompany: RekapanWorkbookBody = {
      "Company A": { records: [] }, // Empty records - carried over from prev month
    };

    const prevMonthWithCompanyA: RekapanWorkbookObj = {
      "Company A": {
        header: {
          Tanggal: { colIndex: 0 },
          Alat1: { colIndex: 1 },
          Alat2: { colIndex: 2 },
        },
        records: [],
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: { Alat1: 100, Alat2: 200 },
      },
    };

    const result = listWorksheetsAlatNames(
      currentMonthWithEmptyRecordsCompany,
      prevMonthWithCompanyA
    );

    // Should preserve alat names from previous month, NOT return empty array
    expect(result["Company A"]).toContain("Alat1");
    expect(result["Company A"]).toContain("Alat2");
    expect(result["Company A"].length).toBe(2);
  });

  it("should get alat names from header when buildInitialRekapanFromValues output is used as prevMonth", () => {
    // After the fix, buildInitialRekapanFromValues creates proper headers with alat names
    // This test verifies that listWorksheetsAlatNames can extract alat names from those headers
    const currentMonthWithEmptyRecordsCompany: RekapanWorkbookBody = {
      "Company A": { records: [] }, // Empty records - carried over from prev month
    };

    // This simulates the FIXED output of buildInitialRekapanFromValues which now has:
    // - header with proper alat names as keys (not empty anymore)
    // - currentBulanTotalSewaAlatAmount with the actual alat totals
    const prevMonthFromBuildInitial: RekapanWorkbookObj = {
      "Company A": {
        header: {
          Tanggal: { colIndex: 0 },
          Alat1: { colIndex: 1 },
          Alat2: { colIndex: 2 },
        },
        records: [],
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: { Alat1: 100, Alat2: 200 },
      },
    };

    const result = listWorksheetsAlatNames(
      currentMonthWithEmptyRecordsCompany,
      prevMonthFromBuildInitial
    );

    // Should get alat names from header
    expect(result["Company A"]).toContain("Alat1");
    expect(result["Company A"]).toContain("Alat2");
    expect(result["Company A"].length).toBe(2);
  });
});
