import { describe, expect, it } from "vitest";
import { parseDateYYYYMMDD } from "./parseDateYYYYMMDD";

describe("parseDateYYYYMMDD", () => {
  it("should parse a valid date string in YYYY-MM-DD format", () => {
    const dateString = "2023-01-15";
    const parsedDate = parseDateYYYYMMDD(dateString);

    expect(parsedDate.isValid()).toBe(true);
    expect(parsedDate.format("YYYY-MM-DD")).toBe(dateString);
  });

  it("should throw an error for an invalid date string", () => {
    const dateString = "2023-02-30"; // Invalid date

    expect(() => parseDateYYYYMMDD(dateString)).toThrow("Invalid date");
  });

  it("should throw an error for a malformed date string", () => {
    const dateString = "2023-15-01"; // Malformed date

    expect(() => parseDateYYYYMMDD(dateString)).toThrow("Invalid date");
  });

  it("should throw an error for a non-date string", () => {
    const dateString = "not-a-date";

    expect(() => parseDateYYYYMMDD(dateString)).toThrow("Invalid date");
  });

  it("should throw an error for an empty string", () => {
    const dateString = "";

    expect(() => parseDateYYYYMMDD(dateString)).toThrow("Invalid date");
  });

  it("should throw an error for a date string in a different format", () => {
    const dateString = "15/01/2023"; // Different format

    expect(() => parseDateYYYYMMDD(dateString)).toThrow("Invalid date");
  });

  it("should handle leap year dates correctly", () => {
    const dateString = "2024-02-29";
    const parsedDate = parseDateYYYYMMDD(dateString);

    expect(parsedDate.isValid()).toBe(true);
    expect(parsedDate.format("YYYY-MM-DD")).toBe(dateString);
  });

  it("should throw an error for an invalid leap year date", () => {
    const dateString = "2023-02-29"; // Invalid leap year date

    expect(() => parseDateYYYYMMDD(dateString)).toThrow("Invalid date");
  });
});
