import { tanggalValueFormatter } from "./tanggalValueFormatter";

describe("tanggal valueFormatter", () => {
  it("should format DD/MM/YYYY to D MMMM", () => {
    const testCases = [
      { input: "01/01/2024", expected: "1 January" },
      { input: "15/02/2024", expected: "15 February" },
      { input: "31/12/2024", expected: "31 December" },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = tanggalValueFormatter({ value: input });
      expect(result).toBe(expected);
    });
  });

  it("should return null for null input", () => {
    const result = tanggalValueFormatter({ value: null });
    expect(result).toBeNull();
  });

  it("should throw an error for invalid date string", () => {
    expect(() => tanggalValueFormatter({ value: "invalid-date" })).toThrow();
  });

  it("should throw an error for non-string input", () => {
    expect(() => tanggalValueFormatter({ value: 123 })).toThrow();
  });
});
