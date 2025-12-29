import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import getTagihanDatePeriods from "./getTagihanDatePeriods";

describe("getTagihanDatePeriods", () => {
  it("should return the correct start and end dates for a given period", () => {
    const period = dayjs("2024-07-15");
    const result = getTagihanDatePeriods(period);

    expect(result).toEqual({
      tanggalStart: "01/07/2024",
      tanggalEnd: "31/07/2024",
      daysInPeriod: 31,
    });
  });

  it("should handle February in a leap year correctly", () => {
    const period = dayjs("2024-02-15");
    const result = getTagihanDatePeriods(period);

    expect(result).toEqual({
      tanggalStart: "01/02/2024",
      tanggalEnd: "29/02/2024",
      daysInPeriod: 29,
    });
  });

  it("should handle February in a non-leap year correctly", () => {
    const period = dayjs("2023-02-15");
    const result = getTagihanDatePeriods(period);

    expect(result).toEqual({
      tanggalStart: "01/02/2023",
      tanggalEnd: "28/02/2023",
      daysInPeriod: 28,
    });
  });

  it("should handle months with 30 days correctly", () => {
    const period = dayjs("2024-04-15");
    const result = getTagihanDatePeriods(period);

    expect(result).toEqual({
      tanggalStart: "01/04/2024",
      tanggalEnd: "30/04/2024",
      daysInPeriod: 30,
    });
  });

  it("should handle months with 31 days correctly", () => {
    const period = dayjs("2024-07-15");
    const result = getTagihanDatePeriods(period);

    expect(result).toEqual({
      tanggalStart: "01/07/2024",
      tanggalEnd: "31/07/2024",
      daysInPeriod: 31,
    });
  });

  const testCases = [
    { date: "2024-01-15", start: "01/01/2024", end: "31/01/2024", days: 31 },
    { date: "2024-02-15", start: "01/02/2024", end: "29/02/2024", days: 29 },
    { date: "2024-03-15", start: "01/03/2024", end: "31/03/2024", days: 31 },
    { date: "2024-04-15", start: "01/04/2024", end: "30/04/2024", days: 30 },
    { date: "2024-05-15", start: "01/05/2024", end: "31/05/2024", days: 31 },
    { date: "2024-06-15", start: "01/06/2024", end: "30/06/2024", days: 30 },
    { date: "2024-07-15", start: "01/07/2024", end: "31/07/2024", days: 31 },
    { date: "2024-08-15", start: "01/08/2024", end: "31/08/2024", days: 31 },
    { date: "2024-09-15", start: "01/09/2024", end: "30/09/2024", days: 30 },
    { date: "2024-10-15", start: "01/10/2024", end: "31/10/2024", days: 31 },
    { date: "2024-11-15", start: "01/11/2024", end: "30/11/2024", days: 30 },
    { date: "2024-12-15", start: "01/12/2024", end: "31/12/2024", days: 31 },
  ];

  testCases.forEach(({ date, start, end, days }) => {
    it(`should return correct dates and days for ${date}`, () => {
      const period = dayjs(date);
      const result = getTagihanDatePeriods(period);

      expect(result).toEqual({
        tanggalStart: start,
        tanggalEnd: end,
        daysInPeriod: days,
      });
    });
  });
});
