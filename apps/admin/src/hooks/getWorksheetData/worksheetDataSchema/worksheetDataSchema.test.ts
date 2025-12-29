import { describe, expect, it } from "vitest";
import { worksheetDataSchema } from "./worksheetDataSchema";

describe("worksheetDataSchema", () => {
  it("should parse valid data correctly", () => {
    // TODO fix this so masuk and keluar are mutually exclusive and that is reflected in the types
    const validData = [
      {
        masuk: "5",
        keluar: "10",
        tanggal: "2023-01-15",
        company_name: "Company A",
        alat_name: "Alat A",
      },
      {
        tanggal: "2024-02-29",
        company_name: "Company B",
        alat_name: "Alat B",
      },
    ];

    const result = worksheetDataSchema.parse(validData);

    expect(result).toEqual([
      {
        masuk: 5,
        keluar: 10,
        tanggal: "15/01/2023",
        company_name: "Company A",
        alat_name: "Alat A",
      },
      {
        tanggal: "29/02/2024",
        company_name: "Company B",
        alat_name: "Alat B",
      },
    ]);
  });

  it("should throw an error for invalid masuk and keluar values", () => {
    const invalidData = [
      {
        masuk: "invalid-number",
        keluar: "10",
        tanggal: "2023-01-15",
        company_name: "Company A",
        alat_name: "Alat A",
      },
    ];

    expect(() => worksheetDataSchema.parse(invalidData)).toThrow();
  });

  it("should throw an error for invalid tanggal format", () => {
    const invalidData = [
      {
        masuk: "5",
        keluar: "10",
        tanggal: "15-01-2023", // Invalid date format
        company_name: "Company A",
        alat_name: "Alat A",
      },
    ];

    expect(() => worksheetDataSchema.parse(invalidData)).toThrow();
  });

  it("should throw an error for non-date tanggal values", () => {
    const invalidData = [
      {
        masuk: "5",
        keluar: "10",
        tanggal: "not-a-date", // Non-date value
        company_name: "Company A",
        alat_name: "Alat A",
      },
    ];

    expect(() => worksheetDataSchema.parse(invalidData)).toThrow();
  });

  it("should parse optional masuk and keluar fields correctly", () => {
    const validData = [
      {
        tanggal: "2023-01-15",
        company_name: "Company A",
        alat_name: "Alat A",
      },
    ];

    const result = worksheetDataSchema.parse(validData);

    expect(result).toEqual([
      {
        tanggal: "15/01/2023",
        company_name: "Company A",
        alat_name: "Alat A",
      },
    ]);
  });

  it("should throw an error for missing required fields", () => {
    const invalidData = [
      {
        tanggal: "2023-01-15",
      },
    ];

    expect(() => worksheetDataSchema.parse(invalidData)).toThrow();
  });
});
