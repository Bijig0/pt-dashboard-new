import { describe, expect, it } from "vitest";
import { createWorksheetsAlatColIndexObj } from "./createWorksheetsAlatColIndexObj";
import { CompanyName, AlatName } from "../../../../types";

// Define the type for better clarity

// Create a mock implementation of listWorksheetsAlatNames
const listWorksheetsAlatNames = (): Record<CompanyName, AlatName[]> => ({
  CompanyA: ["Alat1", "Alat2", "Alat3"],
  CompanyB: ["AlatA", "AlatB"],
});

describe("createWorksheetsAlatColIndexObj", () => {
  it("should create an object with alat names and column indices", () => {
    const currentMonthWorksheetsAlats = listWorksheetsAlatNames();
    const result = createWorksheetsAlatColIndexObj(currentMonthWorksheetsAlats);

    expect(result).toEqual({
      CompanyA: {
        Alat1: { colIndex: 0 },
        Alat2: { colIndex: 1 },
        Alat3: { colIndex: 2 },
      },
      CompanyB: {
        AlatA: { colIndex: 0 },
        AlatB: { colIndex: 1 },
      },
    });
  });

  it("should handle empty worksheets", () => {
    const emptyWorksheets = (): Record<CompanyName, AlatName[]> => ({
      CompanyA: [],
      CompanyB: [],
    });

    const currentMonthWorksheetsAlats = emptyWorksheets();
    const result = createWorksheetsAlatColIndexObj(currentMonthWorksheetsAlats);

    expect(result).toEqual({
      CompanyA: {},
      CompanyB: {},
    });
  });

  it("should handle multiple companies with various alat names", () => {
    const variedWorksheets = (): Record<CompanyName, AlatName[]> => ({
      CompanyA: ["Alat1"],
      CompanyB: ["AlatA", "AlatB", "AlatC"],
      CompanyC: ["AlatX", "AlatY"],
    });

    const currentMonthWorksheetsAlats = variedWorksheets();
    const result = createWorksheetsAlatColIndexObj(currentMonthWorksheetsAlats);

    expect(result).toEqual({
      CompanyA: {
        Alat1: { colIndex: 0 },
      },
      CompanyB: {
        AlatA: { colIndex: 0 },
        AlatB: { colIndex: 1 },
        AlatC: { colIndex: 2 },
      },
      CompanyC: {
        AlatX: { colIndex: 0 },
        AlatY: { colIndex: 1 },
      },
    });
  });
});
