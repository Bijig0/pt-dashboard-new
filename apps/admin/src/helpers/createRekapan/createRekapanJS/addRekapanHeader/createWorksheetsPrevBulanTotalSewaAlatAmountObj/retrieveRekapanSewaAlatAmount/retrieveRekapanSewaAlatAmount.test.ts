import { describe, expect, it } from "vitest";
import { RekapanWorkbookObj } from "../../../../../../hooks/useGetRekapanData";
import { retrieveRekapanSewaAlatAmount } from "./retrieveRekapanSewaAlatAmount";

describe("retrieveRekapanSewaAlatAmount", () => {
  it("should return the correct amount for a specified alat and company given", () => {
    const workbook: RekapanWorkbookObj = {
      "Company A": {
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {
          Tool1: 1000,
          Tool2: 2000,
        },
        header: {},
        records: [],
      },
    };

    const result = retrieveRekapanSewaAlatAmount(workbook)(
      "Tool1",
      "Company A"
    );
    expect(result).toBe(1000);
  });

  it("should return 0 when the company is not found", () => {
    const workbook: RekapanWorkbookObj = {
      "Company A": {
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {
          Tool1: 1000,
        },
        header: {},
        records: [],
      },
    };

    const result = retrieveRekapanSewaAlatAmount(workbook)(
      "Tool1",
      "Nonexistent Company"
    );
    expect(result).toBe(0);
  });

  it("should return 0 when the tool is not found in the company", () => {
    const workbook: RekapanWorkbookObj = {
      "Company A": {
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {
          Tool1: 1000,
        },
        header: {},
        records: [],
      },
    };

    const result = retrieveRekapanSewaAlatAmount(workbook)(
      "NonexistentTool",
      "Company A"
    );
    expect(result).toBe(0);
  });

  it("should throw an error when the amount is not a number", () => {
    const workbook: RekapanWorkbookObj = {
      "Company A": {
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {
          Tool1: "Not a number",
        },
        header: {},
        records: [],
      },
    };

    expect(() =>
      retrieveRekapanSewaAlatAmount(workbook)("Tool1", "Company A")
    ).toThrow("Expected a number, but got string");
  });

  // Note: We can't test for null worksheet value in this structure
  // as the type doesn't allow for null values

  it("should return 0 when the tool amount is undefined", () => {
    const workbook: RekapanWorkbookObj = {
      "Company A": {
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {},
        header: {},
        records: [],
      },
    };

    const result = retrieveRekapanSewaAlatAmount(workbook)(
      "Tool1",
      "Company A"
    );
    expect(result).toBe(0);
  });

  it("should handle a large number of tools", () => {
    const largeWorkbook: RekapanWorkbookObj = {
      LargeCompany: {
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {},
        header: {},
        records: [],
      },
    };

    // Add 10,000 tools
    for (let i = 0; i < 10000; i++) {
      largeWorkbook["LargeCompany"]!.currentBulanTotalSewaAlatAmount[
        `Tool${i}`
      ] = i;
    }

    const retrieveAmount = retrieveRekapanSewaAlatAmount(largeWorkbook);

    // Test a few random tools
    expect(retrieveAmount("Tool0", "LargeCompany")).toBe(0);
    expect(retrieveAmount("Tool999", "LargeCompany")).toBe(999);
    expect(retrieveAmount("Tool9999", "LargeCompany")).toBe(9999);
  });

  it("should handle very large numerical values", () => {
    const workbook: RekapanWorkbookObj = {
      Company: {
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {
          LargeTool: Number.MAX_SAFE_INTEGER,
          NegativeLargeTool: Number.MIN_SAFE_INTEGER,
        },
        header: {},
        records: [],
      },
    };

    const retrieveAmount = retrieveRekapanSewaAlatAmount(workbook);

    expect(retrieveAmount("LargeTool", "Company")).toBe(
      Number.MAX_SAFE_INTEGER
    );
    expect(retrieveAmount("NegativeLargeTool", "Company")).toBe(
      Number.MIN_SAFE_INTEGER
    );
  });

  it("should throw if given a non-numeric value", () => {
    const workbook: RekapanWorkbookObj = {
      Company: {
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {
          StringTool: "Not a number" as any,
          NullTool: null as any,
          UndefinedTool: undefined as any,
        },
        header: {},
        records: [],
      },
    };

    const retrieveAmount = retrieveRekapanSewaAlatAmount(workbook);

    expect(() => retrieveAmount("StringTool", "Company")).toThrow();
  });

  it("should handle missing companies and tools", () => {
    const workbook: RekapanWorkbookObj = {
      Company: {
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {
          ExistingTool: 1000,
        },
        header: {},
        records: [],
      },
    };

    const retrieveAmount = retrieveRekapanSewaAlatAmount(workbook);

    expect(retrieveAmount("ExistingTool", "Company")).toBe(1000);
    expect(retrieveAmount("NonExistentTool", "Company")).toBe(0);
    expect(retrieveAmount("ExistingTool", "NonExistentCompany")).toBe(0);
  });

  it("should handle an empty workbook", () => {
    const emptyWorkbook: RekapanWorkbookObj = {};

    const retrieveAmount = retrieveRekapanSewaAlatAmount(emptyWorkbook);

    expect(retrieveAmount("AnyTool", "AnyCompany")).toBe(0);
  });

  it("should handle special characters in company and tool names", () => {
    const workbook: RekapanWorkbookObj = {
      "Company!@#$%^&*()": {
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {
          "Tool!@#$%^&*()": 1000,
        },
        header: {},
        records: [],
      },
    };

    const retrieveAmount = retrieveRekapanSewaAlatAmount(workbook);

    expect(retrieveAmount("Tool!@#$%^&*()", "Company!@#$%^&*()")).toBe(1000);
  });

  it("should handle very long company and tool names", () => {
    const longName = "a".repeat(1000);
    const workbook: RekapanWorkbookObj = {
      [longName]: {
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {
          [longName]: 1000,
        },
        header: {},
        records: [],
      },
    };

    const retrieveAmount = retrieveRekapanSewaAlatAmount(workbook);

    expect(retrieveAmount(longName, longName)).toBe(1000);
  });

  it("should handle floating point values", () => {
    const workbook: RekapanWorkbookObj = {
      Company: {
        prevBulanTotalSewaAlatAmount: {},
        currentBulanTotalSewaAlatAmount: {
          FloatTool: 1000.5,
        },
        header: {},
        records: [],
      },
    };

    const retrieveAmount = retrieveRekapanSewaAlatAmount(workbook);

    expect(retrieveAmount("FloatTool", "Company")).toBe(1000.5);
  });
});
