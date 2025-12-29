import { checkParsableToDateDDMMYYYY } from "./checkParsableToDateDDMMYYYY"; // Adjust the import path as neededMMYYYY

describe("checkParsableToDateDDMMYYYY", () => {
  test("returns false for yyyy_mm_dd_format", () => {
    expect(checkParsableToDateDDMMYYYY("2023/12/25")).toBe(false);
  });

  test("returns true for valid dd/mm/yyyy format", () => {
    expect(checkParsableToDateDDMMYYYY("25/12/2023")).toBe(true);
  });

  test("returns false for mm/dd/yyyy format", () => {
    expect(checkParsableToDateDDMMYYYY("12/25/2023")).toBe(false);
  });

  test("returns false for invalid date string", () => {
    expect(checkParsableToDateDDMMYYYY("not a date")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(checkParsableToDateDDMMYYYY("")).toBe(false);
  });
});
