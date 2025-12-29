import { describe, expect, it } from "vitest";
import sortRecordsByDate from "./sortRecordsByDate";

describe("sortRecordsByDate", () => {
  it("should sort records by date ascending", () => {
    const input = {
      CompanyA: [
        { tanggal: "15/07/2023", alatName: "Alat1", stokDifference: 5 },
        { tanggal: "01/07/2023", alatName: "Alat2", stokDifference: 3 },
        { tanggal: "10/07/2023", alatName: "Alat1", stokDifference: 2 },
      ],
    };

    const result = sortRecordsByDate(input);

    expect(result["CompanyA"]!.records).toEqual([
      { tanggal: "01/07/2023", alatName: "Alat2", stokDifference: 3 },
      { tanggal: "10/07/2023", alatName: "Alat1", stokDifference: 2 },
      { tanggal: "15/07/2023", alatName: "Alat1", stokDifference: 5 },
    ]);
  });

  it("should preserve multiple records for the same date and alat (regression test)", () => {
    const input = {
      CompanyA: [
        { tanggal: "01/07/2023", alatName: "Alat1", stokDifference: 5 },
        { tanggal: "01/07/2023", alatName: "Alat1", stokDifference: 3 },
        { tanggal: "01/07/2023", alatName: "Alat2", stokDifference: 2 },
      ],
    };

    const result = sortRecordsByDate(input);

    // All 3 records should be preserved, not collapsed
    expect(result["CompanyA"]!.records).toHaveLength(3);
    expect(result["CompanyA"]!.records).toEqual([
      { tanggal: "01/07/2023", alatName: "Alat1", stokDifference: 5 },
      { tanggal: "01/07/2023", alatName: "Alat1", stokDifference: 3 },
      { tanggal: "01/07/2023", alatName: "Alat2", stokDifference: 2 },
    ]);
  });

  it("should handle multiple companies independently", () => {
    const input = {
      CompanyA: [
        { tanggal: "15/07/2023", alatName: "Alat1", stokDifference: 5 },
        { tanggal: "01/07/2023", alatName: "Alat2", stokDifference: 3 },
      ],
      CompanyB: [
        { tanggal: "20/07/2023", alatName: "Alat3", stokDifference: 10 },
        { tanggal: "05/07/2023", alatName: "Alat4", stokDifference: 7 },
      ],
    };

    const result = sortRecordsByDate(input);

    expect(result["CompanyA"]!.records[0].tanggal).toBe("01/07/2023");
    expect(result["CompanyA"]!.records[1].tanggal).toBe("15/07/2023");
    expect(result["CompanyB"]!.records[0].tanggal).toBe("05/07/2023");
    expect(result["CompanyB"]!.records[1].tanggal).toBe("20/07/2023");
  });

  it("should handle empty records array", () => {
    const input = {
      CompanyA: [],
    };

    const result = sortRecordsByDate(input);

    expect(result["CompanyA"]!.records).toEqual([]);
  });

  it("should handle dates across different months and years", () => {
    const input = {
      CompanyA: [
        { tanggal: "15/01/2024", alatName: "Alat1", stokDifference: 1 },
        { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 2 },
        { tanggal: "28/02/2024", alatName: "Alat1", stokDifference: 3 },
      ],
    };

    const result = sortRecordsByDate(input);

    expect(result["CompanyA"]!.records).toEqual([
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 2 },
      { tanggal: "15/01/2024", alatName: "Alat1", stokDifference: 1 },
      { tanggal: "28/02/2024", alatName: "Alat1", stokDifference: 3 },
    ]);
  });
});
