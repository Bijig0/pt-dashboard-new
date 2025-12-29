import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { parseDateDDMMYYYY } from "./parseDateDDMMYYYY"; // Adjust the import path as needed

dayjs.extend(utc);
dayjs.extend(customParseFormat);

describe("parseDateDDMMYYYY", () => {
  it("parses a valid date correctly", () => {
    const result = parseDateDDMMYYYY("25/12/2023");
    expect(result.isValid()).toBe(true);
    expect(result.format("YYYY-MM-DD")).toBe("2023-12-25");
  });

  it("handles single-digit day and month", () => {
    const result = parseDateDDMMYYYY("01/02/2023");
    expect(result.isValid()).toBe(true);
    expect(result.format("YYYY-MM-DD")).toBe("2023-02-01");
  });

  it("throws an error for incorrect format", () => {
    expect(() => parseDateDDMMYYYY("2023-12-25")).toThrow("Invalid date");
  });

  it("handles last day of the year", () => {
    const result = parseDateDDMMYYYY("31/12/2023");
    expect(result.isValid()).toBe(true);
    expect(result.format("YYYY-MM-DD")).toBe("2023-12-31");
  });

  it("handles leap year correctly", () => {
    const result = parseDateDDMMYYYY("29/02/2024");
    expect(result.isValid()).toBe(true);
    expect(result.format("YYYY-MM-DD")).toBe("2024-02-29");
  });

  it("throws an error for non-leap year February 29", () => {
    expect(() => parseDateDDMMYYYY("29/02/2023")).toThrow("Invalid date");
  });

  it("throws an error for non-existent date", () => {
    expect(() => parseDateDDMMYYYY("31/04/2023")).toThrow("Invalid date");
  });

  it("throws an error for empty string", () => {
    expect(() => parseDateDDMMYYYY("")).toThrow("Invalid date");
  });

  it("throws an error for malformed input", () => {
    expect(() => parseDateDDMMYYYY("25/12/abcd")).toThrow("Invalid date");
  });

  it("throws an error for out of range values", () => {
    expect(() => parseDateDDMMYYYY("32/13/2023")).toThrow("Invalid date");
  });
});
