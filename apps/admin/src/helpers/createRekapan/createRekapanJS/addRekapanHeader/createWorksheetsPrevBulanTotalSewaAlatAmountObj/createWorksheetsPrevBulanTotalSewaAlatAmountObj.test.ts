import * as O from "fp-ts/Option";
import { describe, expect, it } from "vitest";
import { RekapanWorkbookObj } from "../../../../../hooks/useGetRekapanData";
import { createWorksheetsPrevBulanTotalSewaAlatAmountObj } from "./createWorksheetsPrevBulanTotalSewaAlatAmountObj";

describe("createWorksheetsPrevBulanTotalSewaAlatAmountObj", () => {
  it("should create correct object for current month worksheets with previous month data", () => {
    const currentMonthWorksheetsAlats = {
      "Company A": ["Tool1", "Tool2"],
      "Company B": ["Tool3"],
    };

    const prevMonthRekapan: RekapanWorkbookObj = {
      "Company A": {
        currentBulanTotalSewaAlatAmount: {
          Tool1: 1000,
          Tool2: 2000,
        },
        prevBulanTotalSewaAlatAmount: {},
        header: {},
        records: [],
      },
      "Company B": {
        currentBulanTotalSewaAlatAmount: {
          Tool3: 3000,
        },
        prevBulanTotalSewaAlatAmount: {},
        header: {},
        records: [],
      },
    };

    const result = createWorksheetsPrevBulanTotalSewaAlatAmountObj(
      currentMonthWorksheetsAlats,
      O.some(prevMonthRekapan)
    );

    expect(result).toEqual({
      "Company A": {
        Tool1: { prevBulanTotalSewaAlatAmount: 1000 },
        Tool2: { prevBulanTotalSewaAlatAmount: 2000 },
      },
      "Company B": {
        Tool3: { prevBulanTotalSewaAlatAmount: 3000 },
      },
    });
  });

  it("should return zero amounts when no previous month data is available", () => {
    const currentMonthWorksheetsAlats = {
      "Company A": ["Tool1", "Tool2"],
      "Company B": ["Tool3"],
    };

    const result = createWorksheetsPrevBulanTotalSewaAlatAmountObj(
      currentMonthWorksheetsAlats,
      O.none
    );

    expect(result).toEqual({
      "Company A": {
        Tool1: { prevBulanTotalSewaAlatAmount: 0 },
        Tool2: { prevBulanTotalSewaAlatAmount: 0 },
      },
      "Company B": {
        Tool3: { prevBulanTotalSewaAlatAmount: 0 },
      },
    });
  });

  it("should handle new tools in current month not present in previous month", () => {
    const currentMonthWorksheetsAlats = {
      "Company A": ["Tool1", "Tool2", "NewTool"],
    };

    const prevMonthRekapan: RekapanWorkbookObj = {
      "Company A": {
        currentBulanTotalSewaAlatAmount: {
          Tool1: 1000,
          Tool2: 2000,
        },
        prevBulanTotalSewaAlatAmount: {},
        header: {},
        records: [],
      },
    };

    const result = createWorksheetsPrevBulanTotalSewaAlatAmountObj(
      currentMonthWorksheetsAlats,
      O.some(prevMonthRekapan)
    );

    expect(result).toEqual({
      "Company A": {
        Tool1: { prevBulanTotalSewaAlatAmount: 1000 },
        Tool2: { prevBulanTotalSewaAlatAmount: 2000 },
        NewTool: { prevBulanTotalSewaAlatAmount: 0 },
      },
    });
  });

  it("should handle new companies in current month not present in previous month", () => {
    const currentMonthWorksheetsAlats = {
      "Company A": ["Tool1"],
      "New Company": ["NewTool"],
    };

    const prevMonthRekapan: RekapanWorkbookObj = {
      "Company A": {
        currentBulanTotalSewaAlatAmount: {
          Tool1: 1000,
        },
        prevBulanTotalSewaAlatAmount: {},
        header: {},
        records: [],
      },
    };

    const result = createWorksheetsPrevBulanTotalSewaAlatAmountObj(
      currentMonthWorksheetsAlats,
      O.some(prevMonthRekapan)
    );

    expect(result).toEqual({
      "Company A": {
        Tool1: { prevBulanTotalSewaAlatAmount: 1000 },
      },
      "New Company": {
        NewTool: { prevBulanTotalSewaAlatAmount: 0 },
      },
    });
  });
});
