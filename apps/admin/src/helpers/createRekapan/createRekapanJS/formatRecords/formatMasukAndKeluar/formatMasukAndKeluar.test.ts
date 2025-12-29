import { formatMasukAndKeluar } from "./formatMasukAndKeluar";

describe("formatMasukAndKeluar", () => {
  it("should handle records with non-zero and non-null masuk values", () => {
    const records = [
      { masuk: 10, keluar: null },
      { masuk: -20, keluar: null },
    ];

    const expected = [
      { masuk: -10, keluar: 0, stokDifference: -10 },
      { masuk: -20, keluar: 0, stokDifference: -20 },
    ];

    const result = formatMasukAndKeluar(records);
    expect(result).toEqual(expected);
  });

  it("should handle records with zero masuk values", () => {
    const records = [
      { masuk: 0, keluar: 5 },
      { masuk: 0, keluar: 10 },
    ];

    const expected = [
      { masuk: 0, keluar: 5, stokDifference: 5 },
      { masuk: 0, keluar: 10, stokDifference: 10 },
    ];

    const result = formatMasukAndKeluar(records);
    expect(result).toEqual(expected);
  });

  it("should handle records with null masuk values", () => {
    const records = [
      { masuk: null, keluar: 5 },
      { masuk: null, keluar: 10 },
    ];

    const expected = [
      { masuk: 0, keluar: 5, stokDifference: 5 },
      { masuk: 0, keluar: 10, stokDifference: 10 },
    ];

    const result = formatMasukAndKeluar(records);
    expect(result).toEqual(expected);
  });

  it("should handle records with null keluar values", () => {
    const records = [
      { masuk: 10, keluar: null },
      { masuk: -20, keluar: null },
    ];

    const expected = [
      { masuk: -10, keluar: 0, stokDifference: -10 },
      { masuk: -20, keluar: 0, stokDifference: -20 },
    ];

    const result = formatMasukAndKeluar(records);
    expect(result).toEqual(expected);
  });

  it("should handle records with both masuk and keluar as zero", () => {
    const records = [{ masuk: 0, keluar: 0 }];

    const expected = [{ masuk: 0, keluar: 0, stokDifference: 0 }];

    const result = formatMasukAndKeluar(records);
    expect(result).toEqual(expected);
  });

  it("should handle records with both masuk and keluar as null", () => {
    const records = [{ masuk: null, keluar: null }];

    const expected = [{ masuk: 0, keluar: 0, stokDifference: 0 }];

    const result = formatMasukAndKeluar(records);
    expect(result).toEqual(expected);
  });

  it("should handle mixed records", () => {
    const records = [
      { masuk: 10, keluar: null },
      { masuk: null, keluar: 5 },
      { masuk: 0, keluar: 10 },
      { masuk: -20, keluar: null },
    ];

    const expected = [
      { masuk: -10, keluar: 0, stokDifference: -10 },
      { masuk: 0, keluar: 5, stokDifference: 5 },
      { masuk: 0, keluar: 10, stokDifference: 10 },
      { masuk: -20, keluar: 0, stokDifference: -20 },
    ];

    const result = formatMasukAndKeluar(records);
    expect(result).toEqual(expected);
  });

  it("should throw an error if both masuk and keluar are present and non-zero", () => {
    const records = [{ masuk: 10, keluar: 5 }];

    expect(() => formatMasukAndKeluar(records)).toThrow();
  });
});
