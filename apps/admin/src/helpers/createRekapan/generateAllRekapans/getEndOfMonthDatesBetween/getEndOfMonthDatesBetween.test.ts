import { getEndOfMonthDatesBetween } from "../generateAllRekapans";

describe("getEndOfMonthDatesBetween", () => {
  it("should return end of month dates for the interval", () => {
    const startDate = new Date(2023, 0, 15); // January 15, 2023
    const endDate = new Date(2023, 2, 15); // March 15, 2023

    const result = getEndOfMonthDatesBetween(startDate, endDate);

    expect(result).toEqual([
      new Date(2023, 0, 31, 23, 59, 59, 999), // January 31, 2023
      new Date(2023, 1, 28, 23, 59, 59, 999), // February 28, 2023
      new Date(2023, 2, 31, 23, 59, 59, 999), // March 31, 2023
    ]);
  });

  it("should return an empty array if start date is after end date", () => {
    const startDate = new Date(2023, 2, 15); // March 15, 2023
    const endDate = new Date(2023, 0, 15); // January 15, 2023

    expect(() => getEndOfMonthDatesBetween(startDate, endDate)).toThrow();
  });

  it("should return a single end of month date if start and end date are in the same month", () => {
    const startDate = new Date(2023, 0, 15); // January 15, 2023
    const endDate = new Date(2023, 0, 25); // January 25, 2023

    const result = getEndOfMonthDatesBetween(startDate, endDate);

    expect(result).toEqual([new Date(2023, 0, 31, 23, 59, 59, 999)]);
  });

  it("should handle end of month dates for a leap year", () => {
    const startDate = new Date(2020, 0, 15); // January 15, 2020
    const endDate = new Date(2020, 2, 15); // March 15, 2020

    const result = getEndOfMonthDatesBetween(startDate, endDate);

    expect(result).toEqual([
      new Date(2020, 0, 31, 23, 59, 59, 999),
      new Date(2020, 1, 29, 23, 59, 59, 999), // February 29, 2020 (leap year)
      new Date(2020, 2, 31, 23, 59, 59, 999),
    ]);
  });

  it("should handle a single day interval", () => {
    const startDate = new Date(2023, 0, 31); // January 31, 2023
    const endDate = new Date(2023, 0, 31); // January 31, 2023

    const result = getEndOfMonthDatesBetween(startDate, endDate);

    expect(result).toEqual([new Date(2023, 0, 31, 23, 59, 59, 999)]);
  });
});
