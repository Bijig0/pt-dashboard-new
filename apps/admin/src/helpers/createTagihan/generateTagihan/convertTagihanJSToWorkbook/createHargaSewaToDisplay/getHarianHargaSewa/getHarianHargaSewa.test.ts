import { getHarianHargaSewa } from "./getHarianHargaSewa";

describe("getHarianHargaSewa", () => {
  it("should correctly calculate and round the daily rental price", () => {
    const hargaSewa = 3000000;
    const daysInMonth = 30;
    const expectedDailyPrice = 100000;

    const result = getHarianHargaSewa(hargaSewa, daysInMonth);

    expect(result).toBe(expectedDailyPrice);
  });

  it("should handle non-integer results correctly", () => {
    const hargaSewa = 3333333;
    const daysInMonth = 30;
    const expectedDailyPrice = 111111.1;

    const result = getHarianHargaSewa(hargaSewa, daysInMonth);

    expect(result).toBeCloseTo(expectedDailyPrice, 2);
  });

  it("should handle edge case with one day in month", () => {
    const hargaSewa = 5000000;
    const daysInMonth = 1;
    const expectedDailyPrice = 5000000;

    const result = getHarianHargaSewa(hargaSewa, daysInMonth);

    expect(result).toBe(expectedDailyPrice);
  });

  it("should handle edge case with zero rental price", () => {
    const hargaSewa = 0;
    const daysInMonth = 30;
    const expectedDailyPrice = 0;

    const result = getHarianHargaSewa(hargaSewa, daysInMonth);

    expect(result).toBe(expectedDailyPrice);
  });

  it("should throw an error with zero days in month", () => {
    const hargaSewa = 3000000;
    const daysInMonth = 0;

    expect(() => getHarianHargaSewa(hargaSewa, daysInMonth)).toThrowError();
  });
});
