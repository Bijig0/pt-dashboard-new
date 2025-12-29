import {
  coerceToDate,
  convert19YearTo20Year,
  replaceOWithZero,
} from "./utils.js";

describe("coerceToDate", () => {
  test("returns the date for Date input", () => {
    const date = new Date();
    const result = coerceToDate(date);
    expect(result).toEqual({ value: date, error: null });
  });

  test("parses valid date string in DD/MM/YYYY format", () => {
    const dateString = "01/12/2020";
    const expectedDate = new Date(2020, 11, 1);
    const result = coerceToDate(dateString);
    expect(result).toEqual({ value: expectedDate, error: null });
  });

  test("returns null and error for invalid date string", () => {
    const invalidDateString = "invalid-date";
    const result = coerceToDate(invalidDateString);
    expect(result.value).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
  });

  test("returns null for undefined input", () => {
    const result = coerceToDate(undefined);
    expect(result).toEqual({ value: undefined, error: null });
  });
});

describe("convert19YearTo20Year", () => {
  it("converts a date from the 1900s to the 2000s", () => {
    const date = new Date("1950-06-15T00:00:00Z");
    const convertedDate = convert19YearTo20Year(date);
    expect(convertedDate.getFullYear()).toBe(2050);
  });

  it("does not convert a date from the 2000s", () => {
    const date = new Date("2050-06-15T00:00:00Z");
    const convertedDate = convert19YearTo20Year(date);
    expect(convertedDate.getFullYear()).toBe(2050);
  });

  it("converts the beginning of the 1900s", () => {
    const date = new Date("1900-01-01T00:00:00Z");
    const convertedDate = convert19YearTo20Year(date);
    expect(convertedDate.getFullYear()).toBe(2000);
  });

  //   it("preserves the rest of the date components", () => {
  //     const date = new Date("1975-07-20T15:30:00Z");
  //     const convertedDate = convert19YearTo20Year(date);
  //     expect(convertedDate.getFullYear()).toBe(2075);
  //     expect(convertedDate.getMonth()).toBe(6); // July (0-indexed)
  //     expect(convertedDate.getDate()).toBe(20);
  //     expect(convertedDate.getHours()).toBe(15);
  //     expect(convertedDate.getMinutes()).toBe(30);
  //     expect(convertedDate.getSeconds()).toBe(0);
  //   });
});

describe("replaceOWithZero", () => {
  it("replaces uppercase O with zero in a date string", () => {
    const input = "15/6/2O23";
    const expected = "15/6/2023";
    expect(replaceOWithZero(input)).toBe(expected);
  });

  it("replaces multiple uppercase Os in a string", () => {
    const input = "OCTOber is cOOl";
    const expected = "0CT0ber is c00l";
    expect(replaceOWithZero(input)).toBe(expected);
  });

  it("returns the same string if there are no uppercase Os", () => {
    const input = "2023-06-15";
    const expected = "2023-06-15";
    expect(replaceOWithZero(input)).toBe(expected);
  });

  it("works with an empty string", () => {
    const input = "";
    const expected = "";
    expect(replaceOWithZero(input)).toBe(expected);
  });

  it("handles a string with only uppercase Os", () => {
    const input = "OOOO";
    const expected = "0000";
    expect(replaceOWithZero(input)).toBe(expected);
  });

  it("does not affect lowercase os", () => {
    const input = "october";
    const expected = "october";
    expect(replaceOWithZero(input)).toBe(expected);
  });
});
