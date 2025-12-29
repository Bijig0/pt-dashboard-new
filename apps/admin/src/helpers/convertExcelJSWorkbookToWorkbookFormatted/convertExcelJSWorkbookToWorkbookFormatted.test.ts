import { Workbook } from "exceljs";
import * as E from "fp-ts/Either";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { convertExcelWorksheetToArrays } from "../../hooks/useGetRekapanData";
import { convertExcelJSWorkbookToWorkbookFormatted } from "./convertExcelJSWorkbookToWorkbookFormatted";

// Mock the convertExcelWorksheetToArrays function
vi.mock("../../hooks/useGetRekapanData", () => ({
  convertExcelWorksheetToArrays: vi.fn(),
}));

describe("convertExcelJSWorkbookToWorkbookFormatted", () => {
  let mockWorkbook: { worksheets: { name: string }[] };

  beforeEach(() => {
    mockWorkbook = {
      worksheets: [{ name: "Sheet1" }, { name: "Sheet2" }],
    };
    vi.mocked(convertExcelWorksheetToArrays).mockClear();
  });

  it("should convert a workbook with multiple worksheets successfully", async () => {
    vi.mocked(convertExcelWorksheetToArrays)
      .mockReturnValueOnce(
        E.right([
          ["A1", "B1"],
          ["A2", "B2"],
        ])
      )
      .mockReturnValueOnce(
        E.right([
          ["C1", "D1"],
          ["C2", "D2"],
        ])
      );

    const result = await convertExcelJSWorkbookToWorkbookFormatted(
      mockWorkbook as Workbook
    );

    expect(result).toEqual({
      Sheet1: [
        ["A1", "B1"],
        ["A2", "B2"],
      ],
      Sheet2: [
        ["C1", "D1"],
        ["C2", "D2"],
      ],
    });
    expect(convertExcelWorksheetToArrays).toHaveBeenCalledTimes(2);
  });

  it("should throw an error if any worksheet conversion fails", async () => {
    const testError = new Error("Conversion failed");
    vi.mocked(convertExcelWorksheetToArrays)
      .mockReturnValueOnce(
        E.right([
          ["A1", "B1"],
          ["A2", "B2"],
        ])
      )
      .mockReturnValueOnce(E.left(testError));

    await expect(
      convertExcelJSWorkbookToWorkbookFormatted(mockWorkbook as Workbook)
    ).rejects.toThrow("Conversion failed");
    expect(convertExcelWorksheetToArrays).toHaveBeenCalledTimes(2);
  });

  it("should handle an empty workbook", async () => {
    mockWorkbook.worksheets = [];

    const result = await convertExcelJSWorkbookToWorkbookFormatted(
      mockWorkbook as Workbook
    );

    expect(result).toEqual({});
    expect(convertExcelWorksheetToArrays).not.toHaveBeenCalled();
  });

  it("should handle worksheets with empty data", async () => {
    vi.mocked(convertExcelWorksheetToArrays)
      .mockReturnValueOnce(E.right([]))
      .mockReturnValueOnce(E.right([]));

    const result = await convertExcelJSWorkbookToWorkbookFormatted(
      mockWorkbook as Workbook
    );

    expect(result).toEqual({
      Sheet1: [],
      Sheet2: [],
    });
    expect(convertExcelWorksheetToArrays).toHaveBeenCalledTimes(2);
  });
});
