import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { describe, expect, it } from "vitest";
import { checkBorrowPeriodForWholeMonth } from "./checkBorrowPeriodForWholeMonth";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

describe("checkBorrowPeriodForWholeMonth", () => {
  it("should return true when borrowed for the whole month", () => {
    const result = checkBorrowPeriodForWholeMonth(31, "15/07/2024");
    expect(result).toBe(true);
  });

  it("should return false when borrowed for less than the whole month", () => {
    const result = checkBorrowPeriodForWholeMonth(30, "15/07/2024");
    expect(result).toBe(false);
  });

  it("should correctly handle February in a non-leap year", () => {
    const result = checkBorrowPeriodForWholeMonth(28, "15/02/2023");
    expect(result).toBe(true);
  });

  it("should correctly handle February in a leap year", () => {
    const result = checkBorrowPeriodForWholeMonth(29, "15/02/2024");
    expect(result).toBe(true);
  });

  it("should handle months with 30 days", () => {
    const result = checkBorrowPeriodForWholeMonth(30, "15/04/2024");
    expect(result).toBe(true);
  });

  it("should throw an error when days borrowed is greater than days in month", () => {
    expect(() => checkBorrowPeriodForWholeMonth(32, "15/07/2024")).toThrow(
      "Days borrowed is greater than days in month"
    );
  });

  it("should throw an assertion error when days borrowed is negative", () => {
    expect(() => checkBorrowPeriodForWholeMonth(-1, "15/07/2024")).toThrow(
      "Days borrowed must be greater than or equal to 0, you can't borrow for a negative number of days"
    );
  });

  it("should handle zero days correctly", () => {
    const result = checkBorrowPeriodForWholeMonth(0, "15/07/2024");
    expect(result).toBe(false);
  });

  it("should handle the last day of the month correctly", () => {
    const result = checkBorrowPeriodForWholeMonth(31, "31/12/2024");
    expect(result).toBe(true);
  });

  it("should handle the first day of the month correctly", () => {
    const result = checkBorrowPeriodForWholeMonth(31, "01/01/2024");
    expect(result).toBe(true);
  });

  it("should handle the first day of July 2024 correctly", () => {
    const result = checkBorrowPeriodForWholeMonth(31, "01/07/2024");
    expect(result).toBe(true);
  });
});
