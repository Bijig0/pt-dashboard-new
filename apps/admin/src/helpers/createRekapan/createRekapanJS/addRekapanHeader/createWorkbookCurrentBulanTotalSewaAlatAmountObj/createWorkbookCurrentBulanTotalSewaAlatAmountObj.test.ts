import { describe, expect, it, vi } from "vitest";
import { RekapanWorkbookBody } from "../../../types";
import {
  WorksheetsAlatHeaderObj,
  createWorkbookCurrentBulanTotalSewaAlatAmountObj,
} from "./createWorkbookCurrentBulanTotalSewaAlatAmountObj";
import * as CreateWorksheetModule from "./createWorksheetCurrentBulanTotalSewaAlatAmountObj/createWorksheetCurrentBulanTotalSewaAlatAmountObj";

describe("createWorkbookCurrentBulanTotalSewaAlatAmountObj", () => {
  const mockCreateWorksheetCurrentBulanTotalSewaAlatAmountObj = vi.spyOn(
    CreateWorksheetModule,
    "createWorksheetCurrentBulanTotalSewaAlatAmountObj"
  );

  mockCreateWorksheetCurrentBulanTotalSewaAlatAmountObj.mockImplementation(
    (worksheet, prevBulanObj) => ({
      Alat1: {
        currentBulanTotalSewaAlatAmount:
          prevBulanObj["Alat1"]!.prevBulanTotalSewaAlatAmount + 100,
      },
      Alat2: {
        currentBulanTotalSewaAlatAmount:
          prevBulanObj["Alat2"]!.prevBulanTotalSewaAlatAmount + 200,
      },
    })
  );

  const mockWorksheets: RekapanWorkbookBody = {
    "Company A": {
      records: [
        {
          tanggal: "01/07/2023",
          stokDifference: 5,
          masuk: 10,
          keluar: 5,
          alatName: "Alat1",
          companyName: "Company A",
        },
      ],
    },
    "Company B": {
      records: [
        {
          tanggal: "01/07/2023",
          stokDifference: 3,
          masuk: 8,
          keluar: 5,
          alatName: "Alat2",
          companyName: "Company B",
        },
      ],
    },
  };

  const mockPrevBulanObj: WorksheetsAlatHeaderObj<{
    prevBulanTotalSewaAlatAmount: number;
  }> = {
    "Company A": {
      Alat1: { prevBulanTotalSewaAlatAmount: 1000 },
      Alat2: { prevBulanTotalSewaAlatAmount: 2000 },
    },
    "Company B": {
      Alat1: { prevBulanTotalSewaAlatAmount: 3000 },
      Alat2: { prevBulanTotalSewaAlatAmount: 4000 },
    },
  };

  it("should calculate current month total sewa alat amount for all companies", () => {
    const result = createWorkbookCurrentBulanTotalSewaAlatAmountObj(
      mockWorksheets,
      mockPrevBulanObj
    );

    expect(result).toEqual({
      "Company A": {
        Alat1: { currentBulanTotalSewaAlatAmount: 1100 },
        Alat2: { currentBulanTotalSewaAlatAmount: 2200 },
      },
      "Company B": {
        Alat1: { currentBulanTotalSewaAlatAmount: 3100 },
        Alat2: { currentBulanTotalSewaAlatAmount: 4200 },
      },
    });
  });

  it("should throw an error if prevBulanTotalSewaAlatAmount is missing for a company", () => {
    const incompletePrevBulanObj = {
      "Company A": {
        Alat1: { prevBulanTotalSewaAlatAmount: 1000 },
        Alat2: { prevBulanTotalSewaAlatAmount: 2000 },
      },
      // Company B is missing
    };

    expect(() => {
      createWorkbookCurrentBulanTotalSewaAlatAmountObj(
        mockWorksheets,
        incompletePrevBulanObj
      );
    }).toThrow("No prevBulanTotalSewaAlatAmount");
  });

  it("should handle empty worksheets", () => {
    const result = createWorkbookCurrentBulanTotalSewaAlatAmountObj(
      {},
      mockPrevBulanObj
    );
    expect(result).toEqual({});
  });

  it("should handle worksheets with no records", () => {
    const emptyWorksheets: RekapanWorkbookBody = {
      "Company A": { records: [] },
      "Company B": { records: [] },
    };

    const result = createWorkbookCurrentBulanTotalSewaAlatAmountObj(
      emptyWorksheets,
      mockPrevBulanObj
    );

    expect(result).toEqual({
      "Company A": {
        Alat1: { currentBulanTotalSewaAlatAmount: 1100 },
        Alat2: { currentBulanTotalSewaAlatAmount: 2200 },
      },
      "Company B": {
        Alat1: { currentBulanTotalSewaAlatAmount: 3100 },
        Alat2: { currentBulanTotalSewaAlatAmount: 4200 },
      },
    });
  });
});
