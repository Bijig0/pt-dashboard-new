import { describe, expect, it } from "vitest";
import { supabaseWorksheetDataSchema } from "./supabaseWorksheetDataSchema";

describe("supabaseWorksheetDataSchema", () => {
  it("parses and transforms date correctly", () => {
    const inputData = [
      {
        tanggal: "2023-12-25",
        masuk: 123,
        keluar: 456,
        company_name: {
          name: "Company A",
        },
        alat_name: {
          name: "Alat A",
        },
      },
    ];

    const expectedData = [
      {
        tanggal: "25/12/2023",
        masuk: 123,
        keluar: 456,
        company_name: {
          name: "Company A",
        },
        alat_name: {
          name: "Alat A",
        },
      },
    ];

    const result = supabaseWorksheetDataSchema.parse(inputData);

    expect(result).toEqual(expectedData);
  });

  it("throws an error for invalid date format", () => {
    const inputData = [
      {
        tanggal: "25/12/2023", // Invalid format, should be YYYY-MM-DD from supabase
        masuk: 123,
        keluar: 456,
        company_name: {
          name: "Company A",
        },
        alat_name: {
          name: "Alat A",
        },
      },
    ];

    expect(() => supabaseWorksheetDataSchema.parse(inputData)).toThrow();
  });

  it("handles nullable fields correctly", () => {
    const inputData = [
      {
        tanggal: "2023-12-25",
        masuk: null,
        keluar: null,
        company_name: {
          name: "Company A",
        },
        alat_name: {
          name: "Alat A",
        },
      },
    ];

    const expectedData = [
      {
        tanggal: "25/12/2023",
        masuk: null,
        keluar: null,
        company_name: {
          name: "Company A",
        },
        alat_name: {
          name: "Alat A",
        },
      },
    ];

    const result = supabaseWorksheetDataSchema.parse(inputData);

    expect(result).toEqual(expectedData);
  });

  it("throws an error for invalid date", () => {
    const inputData = [
      {
        tanggal: "2023-13-40", // Invalid date
        masuk: 123,
        keluar: 456,
        company_name: {
          name: "Company A",
        },
        alat_name: {
          name: "Alat A",
        },
      },
    ];

    expect(() => supabaseWorksheetDataSchema.parse(inputData)).toThrow();
  });
});
