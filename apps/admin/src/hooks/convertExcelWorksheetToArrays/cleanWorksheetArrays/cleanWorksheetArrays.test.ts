import { WorksheetSchema } from "../../../helpers/excel-types";
import { cleanWorksheetArrays } from "./cleanWorksheetArrays";

describe("cleanWorksheetArrays", () => {
  it("should clean the worksheet by removing the first row and first element of each row", () => {
    const input: WorksheetSchema = [
      undefined,
      [undefined, "Row1Col1", "Row1Col2", "Row1Col3"],
      [undefined, "Row2Col1", "Row2Col2", "Row2Col3"],
    ];

    const expectedOutput = [
      ["Row1Col1", "Row1Col2", "Row1Col3"],
      ["Row2Col1", "Row2Col2", "Row2Col3"],
    ];

    expect(cleanWorksheetArrays(input)).toEqual(expectedOutput);
  });

  it("should handle rows with undefined or null values correctly", () => {
    const input: WorksheetSchema = [
      undefined,
      [undefined, "Row1Col1", undefined, "Row1Col3"],
      [undefined, undefined, "Row2Col2", "Row2Col3"],
      [undefined, "Row3Col1", "Row3Col2", undefined],
    ];

    const expectedOutput = [
      ["Row1Col1", undefined, "Row1Col3"],
      [undefined, "Row2Col2", "Row2Col3"],
      ["Row3Col1", "Row3Col2", undefined],
    ];

    expect(cleanWorksheetArrays(input)).toEqual(expectedOutput);
  });

  it(`should receive an array with undefined as the first item as its empty array, it must ALWAYS have at least that 1 undefined,
         just how exceljs getSheetValues() works`, () => {
    const input: WorksheetSchema = [undefined];

    expect(cleanWorksheetArrays(input)).toEqual([]);
  });

  it("should handle single row correctly", () => {
    const input: WorksheetSchema = [
      undefined,
      [undefined, "Header1", "Header2", "Header3"],
    ];

    const expectedOutput = [["Header1", "Header2", "Header3"]];

    expect(cleanWorksheetArrays(input)).toEqual(expectedOutput);
  });

  it("should handle single column correctly", () => {
    const input: WorksheetSchema = [
      undefined,
      [undefined, "Row1Col1"],
      [undefined, "Row2Col1"],
    ];

    const expectedOutput = [["Row1Col1"], ["Row2Col1"]];

    expect(cleanWorksheetArrays(input)).toEqual(expectedOutput);
  });
});
