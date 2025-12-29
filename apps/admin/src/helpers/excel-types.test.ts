import { worksheetRowSchema, worksheetSchema } from "./excel-types";

describe("worksheetRowSchema", () => {
  it("should validate a correct row", () => {
    const row = [undefined, "string", 123, new Date(), undefined];
    expect(() => worksheetRowSchema.parse(row)).not.toThrow();
  });

  it("should fail if first element is not undefined", () => {
    const row = ["string", "string", 123, new Date(), undefined];
    expect(() => worksheetRowSchema.parse(row)).toThrow();
  });

  it("should validate rows with various correct data types", () => {
    const row = [
      undefined,
      "string",
      123,
      new Date(),
      undefined,
      "another string",
    ];
    expect(() => worksheetRowSchema.parse(row)).not.toThrow();
  });

  it("should fail if any element is not a string, number, date, or undefined", () => {
    const row = [undefined, "string", 123, {}, undefined];
    expect(() => worksheetRowSchema.parse(row)).toThrow();
  });
});

describe("worksheetSchema", () => {
  it("should validate a correct worksheet", () => {
    const worksheet = [
      undefined,
      [undefined, "string", 123, new Date(), undefined],
      [undefined, "another string", 456, new Date()],
    ];
    expect(() => worksheetSchema.parse(worksheet)).not.toThrow();
  });

  it("should fail if first element of the worksheet is not undefined", () => {
    const worksheet = [
      "string",
      [undefined, "string", 123, new Date(), undefined],
      [undefined, "another string", 456, new Date()],
    ];
    expect(() => worksheetSchema.parse(worksheet)).toThrow();
  });

  it("should fail if any row does not match the row schema", () => {
    const worksheet = [
      undefined,
      [undefined, "string", 123, new Date(), undefined],
      ["invalid", "another string", 456, new Date()],
    ];
    expect(() => worksheetSchema.parse(worksheet)).toThrow();
  });

  it("should handle empty rows correctly", () => {
    const worksheet = [undefined, [], [undefined, "string"], [undefined, 123]];
    expect(() => worksheetSchema.parse(worksheet)).not.toThrow();
  });

  it("should handle empty worksheet correctly", () => {
    const worksheet = [undefined];
    expect(() => worksheetSchema.parse(worksheet)).not.toThrow();
  });

  it("should allow for empty rows at the top and bottom of the worksheet", () => {
    const worksheet = [
      undefined,
      //   Empty rows can come in the form of undefined
      undefined,
      //   Or an empty array
      [],
      [undefined, "string"],
      [undefined, 123],
      undefined,
    ];
    expect(() => worksheetSchema.parse(worksheet)).not.toThrow();
  });
});
