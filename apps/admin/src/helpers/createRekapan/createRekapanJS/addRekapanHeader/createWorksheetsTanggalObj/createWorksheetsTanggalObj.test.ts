import { describe, expect, it, vi } from "vitest";
import { createWorksheetsTanggalObj } from "./createWorksheetsTanggalObj";

// Mock the required types and functions
type CompanyName = string;
type AlatName = string;
type RekapanWorkbookBody = Record<string, any>; // Simplified for testing purposes
type WorksheetsAlatHeaderObj<Obj extends Record<PropertyKey, any>> = Record<
  CompanyName,
  Record<AlatName, Obj>
>;

// Mock the getRekapanMonth function
vi.mock("./getRekapanMonth/getRekapanMonth", () => {
  return {
    getRekapanMonth: vi.fn().mockReturnValue(5), // Mocking it to always return 5 (June)
  };
});

describe("createWorksheetsTanggalObj", () => {
  it("should annotate each alat with the current month's rekapanMonth", () => {
    const currentMonthWorksheetAlatNames = {
      "Company A": ["Alat1", "Alat2"],
      "Company B": ["Alat3"],
    };

    const currentMonthRekapanWorkbookBody = {} as RekapanWorkbookBody; // Not used in the function, so we can mock it as empty

    const result = createWorksheetsTanggalObj(
      currentMonthWorksheetAlatNames,
      currentMonthRekapanWorkbookBody
    );

    expect(result).toEqual({
      "Company A": {
        Alat1: { rekapanMonth: 5 },
        Alat2: { rekapanMonth: 5 },
      },
      "Company B": {
        Alat3: { rekapanMonth: 5 },
      },
    });
  });

  it("should handle empty input correctly", () => {
    const currentMonthWorksheetAlatNames = {};
    const currentMonthRekapanWorkbookBody = {} as RekapanWorkbookBody;

    const result = createWorksheetsTanggalObj(
      currentMonthWorksheetAlatNames,
      currentMonthRekapanWorkbookBody
    );

    expect(result).toEqual({});
  });

  it("should handle multiple companies with multiple tools", () => {
    const currentMonthWorksheetAlatNames = {
      "Company A": ["Alat1", "Alat2", "Alat3"],
      "Company B": ["Alat4", "Alat5"],
      "Company C": ["Alat6"],
    };

    const currentMonthRekapanWorkbookBody = {} as RekapanWorkbookBody;

    const result = createWorksheetsTanggalObj(
      currentMonthWorksheetAlatNames,
      currentMonthRekapanWorkbookBody
    );

    expect(result).toEqual({
      "Company A": {
        Alat1: { rekapanMonth: 5 },
        Alat2: { rekapanMonth: 5 },
        Alat3: { rekapanMonth: 5 },
      },
      "Company B": {
        Alat4: { rekapanMonth: 5 },
        Alat5: { rekapanMonth: 5 },
      },
      "Company C": {
        Alat6: { rekapanMonth: 5 },
      },
    });
  });

  it("should handle a company with no tools", () => {
    const currentMonthWorksheetAlatNames = {
      "Company A": ["Alat1", "Alat2"],
      "Company B": [],
    };

    const currentMonthRekapanWorkbookBody = {} as RekapanWorkbookBody;

    const result = createWorksheetsTanggalObj(
      currentMonthWorksheetAlatNames,
      currentMonthRekapanWorkbookBody
    );

    expect(result).toEqual({
      "Company A": {
        Alat1: { rekapanMonth: 5 },
        Alat2: { rekapanMonth: 5 },
      },
      "Company B": {},
    });
  });
});
