import { fillEmptyItemsWithUndefined } from "./fillEmptyWithUndefined";

describe("fillEmptyItemsWithUndefined", () => {
  it("should replace empty items with undefined", () => {
    const input = [1, 2, , 4];
    const expectedOutput = [1, 2, undefined, 4];
    expect(fillEmptyItemsWithUndefined(input)).toEqual(expectedOutput);
  });

  it("should not modify arrays that have no empty items", () => {
    const input = [1, 2, 3, 4];
    const expectedOutput = [1, 2, 3, 4];
    expect(fillEmptyItemsWithUndefined(input)).toEqual(expectedOutput);
  });

  it("should handle arrays with only empty items", () => {
    const input = [, , ,];
    const expectedOutput = [undefined, undefined, undefined];
    expect(fillEmptyItemsWithUndefined(input)).toEqual(expectedOutput);
  });

  it("should handle arrays with a mix of empty and non-empty items", () => {
    const input = [undefined, 2, , "test", , null];
    const expectedOutput = [undefined, 2, undefined, "test", undefined, null];
    expect(fillEmptyItemsWithUndefined(input)).toEqual(expectedOutput);
  });

  it("should handle an empty array", () => {
    const input: any[] = [];
    const expectedOutput: any[] = [];
    expect(fillEmptyItemsWithUndefined(input)).toEqual(expectedOutput);
  });

  it("should handle arrays with a single empty item", () => {
    const input = [,];
    const expectedOutput = [undefined];
    expect(fillEmptyItemsWithUndefined(input)).toEqual(expectedOutput);
  });

  it("should handle arrays with nested empty items", () => {
    const input = [[1, , 3], , [4, 5]];
    const expectedOutput = [[1, undefined, 3], undefined, [4, 5]];
    expect(fillEmptyItemsWithUndefined(input)).toEqual(expectedOutput);
  });
});
