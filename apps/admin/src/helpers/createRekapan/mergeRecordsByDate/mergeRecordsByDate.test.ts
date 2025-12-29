import { describe, expect, it } from "vitest";
import { mergeRecordsByDate } from "./mergeRecordsByDate";

describe("mergeRecordsByDate", () => {
  it("merges records with different alats on same date into one row", () => {
    const records = [
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 5 },
      { tanggal: "01/12/2023", alatName: "Alat2", stokDifference: 7 },
    ];

    const result = mergeRecordsByDate(records);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      Tanggal: "01/12/2023",
      Alat1: 5,
      Alat2: 7,
    });
  });

  it("creates separate rows for same alat on same date (collision)", () => {
    const records = [
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 5 },
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 3 },
    ];

    const result = mergeRecordsByDate(records);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ Tanggal: "01/12/2023", Alat1: 5 });
    expect(result[1]).toEqual({ Tanggal: "01/12/2023", Alat1: 3 });
  });

  it("handles mixed scenario correctly - merges where possible, splits on collision", () => {
    const records = [
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 5 },
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 3 },
      { tanggal: "01/12/2023", alatName: "Alat2", stokDifference: 7 },
    ];

    const result = mergeRecordsByDate(records);

    expect(result).toHaveLength(2);
    // First row: Alat1 from record 1, Alat2 from record 3 (merged)
    expect(result[0]).toEqual({
      Tanggal: "01/12/2023",
      Alat1: 5,
      Alat2: 7,
    });
    // Second row: Alat1 from record 2 (collision - needed new row)
    expect(result[1]).toEqual({ Tanggal: "01/12/2023", Alat1: 3 });
  });

  it("handles different dates separately", () => {
    const records = [
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 5 },
      { tanggal: "02/12/2023", alatName: "Alat1", stokDifference: 3 },
    ];

    const result = mergeRecordsByDate(records);

    expect(result).toHaveLength(2);
    expect(result[0].Tanggal).toBe("01/12/2023");
    expect(result[1].Tanggal).toBe("02/12/2023");
  });

  it("handles empty records array", () => {
    const records: { tanggal: string; alatName: string; stokDifference: number }[] = [];

    const result = mergeRecordsByDate(records);

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it("handles three records with same alat on same date", () => {
    const records = [
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 5 },
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 3 },
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 8 },
    ];

    const result = mergeRecordsByDate(records);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ Tanggal: "01/12/2023", Alat1: 5 });
    expect(result[1]).toEqual({ Tanggal: "01/12/2023", Alat1: 3 });
    expect(result[2]).toEqual({ Tanggal: "01/12/2023", Alat1: 8 });
  });

  it("fills second row with different alat when first row has collision", () => {
    const records = [
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 5 },
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 3 },
      { tanggal: "01/12/2023", alatName: "Alat2", stokDifference: 7 },
      { tanggal: "01/12/2023", alatName: "Alat2", stokDifference: 9 },
    ];

    const result = mergeRecordsByDate(records);

    expect(result).toHaveLength(2);
    // First row: Alat1=5, Alat2=7
    expect(result[0]).toEqual({
      Tanggal: "01/12/2023",
      Alat1: 5,
      Alat2: 7,
    });
    // Second row: Alat1=3, Alat2=9 (both need second row due to collision)
    expect(result[1]).toEqual({
      Tanggal: "01/12/2023",
      Alat1: 3,
      Alat2: 9,
    });
  });

  it("handles null stokDifference values", () => {
    const records = [
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: null },
      { tanggal: "01/12/2023", alatName: "Alat2", stokDifference: 7 },
    ];

    const result = mergeRecordsByDate(records);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      Tanggal: "01/12/2023",
      Alat1: null,
      Alat2: 7,
    });
  });

  it("handles complex scenario with multiple dates and alats", () => {
    const records = [
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 1 },
      { tanggal: "01/12/2023", alatName: "Alat2", stokDifference: 2 },
      { tanggal: "02/12/2023", alatName: "Alat1", stokDifference: 3 },
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 4 }, // Collision with row 0
      { tanggal: "02/12/2023", alatName: "Alat2", stokDifference: 5 },
    ];

    const result = mergeRecordsByDate(records);

    expect(result).toHaveLength(3);
    // First row (01/12): Alat1=1, Alat2=2
    expect(result[0]).toEqual({
      Tanggal: "01/12/2023",
      Alat1: 1,
      Alat2: 2,
    });
    // Second row (02/12): Alat1=3, Alat2=5
    expect(result[1]).toEqual({
      Tanggal: "02/12/2023",
      Alat1: 3,
      Alat2: 5,
    });
    // Third row (01/12 collision): Alat1=4
    expect(result[2]).toEqual({
      Tanggal: "01/12/2023",
      Alat1: 4,
    });
  });

  it("handles dates with whitespace - trims and merges correctly", () => {
    const records = [
      { tanggal: "01/12/2023", alatName: "Alat1", stokDifference: 5 },
      { tanggal: "01/12/2023 ", alatName: "Alat2", stokDifference: 7 }, // trailing space
    ];

    const result = mergeRecordsByDate(records);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      Tanggal: "01/12/2023",
      Alat1: 5,
      Alat2: 7,
    });
  });

  it("handles dates with leading whitespace", () => {
    const records = [
      { tanggal: " 01/12/2023", alatName: "Alat1", stokDifference: 5 }, // leading space
      { tanggal: "01/12/2023", alatName: "Alat2", stokDifference: 7 },
    ];

    const result = mergeRecordsByDate(records);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      Tanggal: "01/12/2023",
      Alat1: 5,
      Alat2: 7,
    });
  });
});
