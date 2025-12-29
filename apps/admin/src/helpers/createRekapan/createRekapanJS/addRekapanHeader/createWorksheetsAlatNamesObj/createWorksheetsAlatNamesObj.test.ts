import { describe, expect, it } from "vitest";
import { createWorksheetsAlatNamesObj } from "./createWorksheetsAlatNamesObj";

// Mock the required types
type CompanyName = string;
type AlatName = string;
type WorksheetsAlatHeaderObj<Obj extends Record<PropertyKey, any>> = Record<
  CompanyName,
  Record<AlatName, Obj>
>;

describe("createWorksheetsAlatNamesObj", () => {
  it("should create correct object structure for multiple companies and tools", () => {
    const input = {
      "Company A": ["Tool 1", "Tool 2"],
      "Company B": ["Tool 3"],
    };

    const result = createWorksheetsAlatNamesObj(input);

    expect(result).toEqual({
      "Company A": {
        "Tool 1": { alatName: "Tool 1" },
        "Tool 2": { alatName: "Tool 2" },
      },
      "Company B": {
        "Tool 3": { alatName: "Tool 3" },
      },
    });
  });

  it("should handle empty input correctly", () => {
    const input = {};

    const result = createWorksheetsAlatNamesObj(input);

    expect(result).toEqual({});
  });

  it("should handle a company with no tools", () => {
    const input = {
      "Company A": ["Tool 1", "Tool 2"],
      "Company B": [],
    };

    const result = createWorksheetsAlatNamesObj(input);

    expect(result).toEqual({
      "Company A": {
        "Tool 1": { alatName: "Tool 1" },
        "Tool 2": { alatName: "Tool 2" },
      },
      "Company B": {},
    });
  });

  it("should handle multiple companies with multiple tools", () => {
    const input = {
      "Company A": ["Tool 1", "Tool 2", "Tool 3"],
      "Company B": ["Tool 4", "Tool 5"],
      "Company C": ["Tool 6"],
    };

    const result = createWorksheetsAlatNamesObj(input);

    expect(result).toEqual({
      "Company A": {
        "Tool 1": { alatName: "Tool 1" },
        "Tool 2": { alatName: "Tool 2" },
        "Tool 3": { alatName: "Tool 3" },
      },
      "Company B": {
        "Tool 4": { alatName: "Tool 4" },
        "Tool 5": { alatName: "Tool 5" },
      },
      "Company C": {
        "Tool 6": { alatName: "Tool 6" },
      },
    });
  });

  it("should handle tools with special characters or spaces", () => {
    const input = {
      "Company A": ["Tool 1", "Special Tool!", "Tool with spaces"],
    };

    const result = createWorksheetsAlatNamesObj(input);

    expect(result).toEqual({
      "Company A": {
        "Tool 1": { alatName: "Tool 1" },
        "Special Tool!": { alatName: "Special Tool!" },
        "Tool with spaces": { alatName: "Tool with spaces" },
      },
    });
  });
});
