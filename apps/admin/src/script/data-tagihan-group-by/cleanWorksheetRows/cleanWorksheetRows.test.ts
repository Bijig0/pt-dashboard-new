import ExcelJS from "exceljs";
import { cleanWorksheetRows } from "./cleanWorksheetRows";

describe("cleanWorksheetRows", () => {
  it("should remove all rows before the TGL header", () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Test");

    // Add rows before TGL
    worksheet.addRow(["Header 1", "Header 2"]);
    worksheet.addRow(["Some metadata", "value"]);
    worksheet.addRow(["Another row", "data"]);
    // Add the TGL row (should become row 1 after cleaning)
    worksheet.addRow(["TGL", "URAIAN", "JUMLAH"]);
    // Add data rows
    worksheet.addRow(["2025-01-01", "Item 1", 100]);
    worksheet.addRow(["2025-01-02", "Item 2", 200]);

    const cleaned = cleanWorksheetRows({ worksheet });

    expect(cleaned.rowCount).toBe(3); // TGL header + 2 data rows
    expect(cleaned.getRow(1).getCell(1).value).toBe("TGL");
    expect(cleaned.getRow(2).getCell(1).value).toBe("2025-01-01");
    expect(cleaned.getRow(3).getCell(1).value).toBe("2025-01-02");
  });

  it("should remove blank rows within the data", () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Test");

    // Add the TGL row
    worksheet.addRow(["TGL", "URAIAN", "JUMLAH"]);
    // Add data rows with blank rows in between
    worksheet.addRow(["2025-01-01", "Item 1", 100]);
    worksheet.addRow(["2025-01-02", "Item 2", 200]);
    worksheet.addRow([]); // Blank row
    worksheet.addRow(["2025-01-03", "Item 3", 300]);
    worksheet.addRow(["", "", ""]); // Blank row with empty strings
    worksheet.addRow(["2025-01-04", "Item 4", 400]);
    worksheet.addRow([null, null, null]); // Blank row with nulls

    const cleaned = cleanWorksheetRows({ worksheet });

    expect(cleaned.rowCount).toBe(5); // TGL header + 4 data rows
    expect(cleaned.getRow(1).getCell(1).value).toBe("TGL");
    expect(cleaned.getRow(2).getCell(1).value).toBe("2025-01-01");
    expect(cleaned.getRow(3).getCell(1).value).toBe("2025-01-02");
    expect(cleaned.getRow(4).getCell(1).value).toBe("2025-01-03");
    expect(cleaned.getRow(5).getCell(1).value).toBe("2025-01-04");
  });

  it("should handle TGL in different cases", () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Test");

    // Add rows before TGL
    worksheet.addRow(["Header 1", "Header 2"]);
    worksheet.addRow(["Some metadata", "value"]);
    // Add the TGL row with lowercase
    worksheet.addRow(["tgl", "URAIAN", "JUMLAH"]);
    worksheet.addRow(["2025-01-01", "Item 1", 100]);

    const cleaned = cleanWorksheetRows({ worksheet });

    expect(cleaned.rowCount).toBe(2); // TGL header + 1 data row
    expect(cleaned.getRow(1).getCell(1).value).toBe("tgl");
  });

  it("should handle worksheet with only TGL row", () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Test");

    worksheet.addRow(["Header 1", "Header 2"]);
    worksheet.addRow(["TGL", "URAIAN", "JUMLAH"]);

    const cleaned = cleanWorksheetRows({ worksheet });

    expect(cleaned.rowCount).toBe(1); // Only TGL header
    expect(cleaned.getRow(1).getCell(1).value).toBe("TGL");
  });

  it("should handle consecutive blank rows", () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Test");

    worksheet.addRow(["TGL", "URAIAN", "JUMLAH"]);
    worksheet.addRow(["2025-01-01", "Item 1", 100]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow(["2025-01-02", "Item 2", 200]);

    const cleaned = cleanWorksheetRows({ worksheet });

    expect(cleaned.rowCount).toBe(3); // TGL header + 2 data rows
    expect(cleaned.getRow(2).getCell(1).value).toBe("2025-01-01");
    expect(cleaned.getRow(3).getCell(1).value).toBe("2025-01-02");
  });

  it("should handle rows with whitespace as blank", () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Test");

    worksheet.addRow(["TGL", "URAIAN", "JUMLAH"]);
    worksheet.addRow(["2025-01-01", "Item 1", 100]);
    worksheet.addRow(["  ", "   ", "  "]); // Blank row with whitespace
    worksheet.addRow(["2025-01-02", "Item 2", 200]);

    const cleaned = cleanWorksheetRows({ worksheet });

    expect(cleaned.rowCount).toBe(3); // TGL header + 2 data rows
    expect(cleaned.getRow(2).getCell(1).value).toBe("2025-01-01");
    expect(cleaned.getRow(3).getCell(1).value).toBe("2025-01-02");
  });

  it("should find TGL in any column of the row", () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Test");

    // Add rows before TGL
    worksheet.addRow(["Header 1", "Header 2", "Header 3"]);
    worksheet.addRow(["Some metadata", "value", "more"]);
    // TGL is in the third column
    worksheet.addRow(["Col1", "Col2", "TGL", "URAIAN"]);
    worksheet.addRow(["data1", "data2", "2025-01-01", "Item 1"]);

    const cleaned = cleanWorksheetRows({ worksheet });

    expect(cleaned.rowCount).toBe(2);
    expect(cleaned.getRow(1).getCell(3).value).toBe("TGL");
    expect(cleaned.getRow(2).getCell(3).value).toBe("2025-01-01");
  });

  it("should preserve data integrity after cleaning", () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Test");

    worksheet.addRow(["Metadata"]);
    worksheet.addRow(["More metadata"]);
    worksheet.addRow(["TGL", "URAIAN", "DEBIT", "KREDIT"]);
    worksheet.addRow(["2025-01-01", "Payment", 1000, 0]);
    worksheet.addRow([]);
    worksheet.addRow(["2025-01-02", "Receipt", 0, 500]);

    const cleaned = cleanWorksheetRows({ worksheet });

    expect(cleaned.rowCount).toBe(3);
    // Check that all data is preserved
    expect(cleaned.getRow(1).getCell(1).value).toBe("TGL");
    expect(cleaned.getRow(1).getCell(2).value).toBe("URAIAN");
    expect(cleaned.getRow(1).getCell(3).value).toBe("DEBIT");
    expect(cleaned.getRow(1).getCell(4).value).toBe("KREDIT");

    expect(cleaned.getRow(2).getCell(1).value).toBe("2025-01-01");
    expect(cleaned.getRow(2).getCell(2).value).toBe("Payment");
    expect(cleaned.getRow(2).getCell(3).value).toBe(1000);
    expect(cleaned.getRow(2).getCell(4).value).toBe(0);

    expect(cleaned.getRow(3).getCell(1).value).toBe("2025-01-02");
    expect(cleaned.getRow(3).getCell(2).value).toBe("Receipt");
    expect(cleaned.getRow(3).getCell(3).value).toBe(0);
    expect(cleaned.getRow(3).getCell(4).value).toBe(500);
  });
});
