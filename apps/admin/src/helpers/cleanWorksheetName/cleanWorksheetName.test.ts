import cleanWorksheetName from "./cleanWorksheetName";

describe("cleanWorksheetName", () => {
  it("should replace invalid characters with whitespace", () => {
    const input = "Sheet?:/\\[]Name";
    const result = cleanWorksheetName(input);
    expect(result).toContain("Sheet");
    expect(result).toContain("Name");
    expect(result).not.toContain("?");
    expect(result).not.toContain(":");
    expect(result).not.toContain("/");
    expect(result).not.toContain("\\");
    expect(result).not.toContain("[");
    expect(result).not.toContain("]");
  });

  it("should remove quotation marks from the beginning and end of the string", () => {
    const input = '"SheetName"';
    const result = cleanWorksheetName(input);
    expect(result).toContain("SheetName");
    expect(result).not.toContain('"');
  });

  it("should truncate the string to 31 characters if it exceeds the limit", () => {
    const input = "SheetNameThatIsWayTooLongForAnExcelWorksheet";
    const result = cleanWorksheetName(input);
    expect(result.length).toBeLessThanOrEqual(31);
  });

  it("should handle strings with a mix of invalid characters and excessive length", () => {
    const input = '"Sheet?:/\\[]NameThatIsWayTooLongForAnExcelWorksheet"';
    const result = cleanWorksheetName(input);
    expect(result).toContain("Sheet");
    expect(result).toContain("Name");
    expect(result).not.toContain("?");
    expect(result).not.toContain(":");
    expect(result).not.toContain("/");
    expect(result).not.toContain("\\");
    expect(result).not.toContain("[");
    expect(result).not.toContain("]");
    expect(result).not.toContain('"');
    expect(result.length).toBeLessThanOrEqual(31);
  });

  it("should return the same string if no invalid characters and within length limit", () => {
    const input = "ValidSheetName";
    const expected = "ValidSheetName";
    const result = cleanWorksheetName(input);
    expect(result).toBe(expected);
  });

  it("should remove single quotation marks from the beginning and end of the string", () => {
    const input = "'SheetName'";
    const result = cleanWorksheetName(input);
    expect(result).toContain("SheetName");
    expect(result).not.toContain("'");
  });

  it("should handle an empty string", () => {
    const input = "";
    const result = cleanWorksheetName(input);
    expect(result).toBe("");
  });

  it("should handle a string with only invalid characters", () => {
    const input = "?:/\\[]\"'";
    const result = cleanWorksheetName(input);
    expect(result).not.toContain("?");
    expect(result).not.toContain(":");
    expect(result).not.toContain("/");
    expect(result).not.toContain("\\");
    expect(result).not.toContain("[");
    expect(result).not.toContain("]");
    expect(result).not.toContain('"');
    expect(result).not.toContain("'");
  });

  it("should handle a string with spaces and invalid characters", () => {
    const input = "Sheet ?: / \\ [ ] Name";
    const result = cleanWorksheetName(input);
    expect(result).toContain("Sheet");
    expect(result).toContain("Name");
    expect(result).not.toContain("?");
    expect(result).not.toContain(":");
    expect(result).not.toContain("/");
    expect(result).not.toContain("\\");
    expect(result).not.toContain("[");
    expect(result).not.toContain("]");
  });

  it("should handle a string with multiple invalid characters in a row", () => {
    const input = "Sheet??:/\\[]Name";
    const result = cleanWorksheetName(input);
    expect(result).toContain("Sheet");
    expect(result).toContain("Name");
    expect(result).not.toContain("?");
    expect(result).not.toContain(":");
    expect(result).not.toContain("/");
    expect(result).not.toContain("\\");
    expect(result).not.toContain("[");
    expect(result).not.toContain("]");
  });
});
