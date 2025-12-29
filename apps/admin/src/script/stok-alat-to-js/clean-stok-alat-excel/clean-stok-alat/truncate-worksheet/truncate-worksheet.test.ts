import ExcelJS from "exceljs";
import { truncateWorksheetRows } from "./truncate-worksheet";

describe("truncateWorksheetRows", () => {
  let workbook: ExcelJS.Workbook;

  beforeEach(() => {
    // Create a new workbook for each test
    workbook = new ExcelJS.Workbook();
  });

  it("should remove rows above the first date row", async () => {
    // Create a worksheet with sample data
    const worksheet = workbook.addWorksheet("Test");
    worksheet.addRow(["NAMA BARANG : HOLLOW 50x10x4M DINDING", "", "", "", ""]);
    worksheet.addRow(["", "", "", "", ""]);
    worksheet.addRow(["TGL", "KETERANGAN", "MASUK", "KELUAR", "SISA"]);
    worksheet.addRow(["9/9/2016", "JAGAT-BEKASI", 84, "", 84]);
    worksheet.addRow(["9/9/2016", "JAGAT-BEKASI", 38, "", 122]);
    worksheet.addRow(["14/9/16", "JAGAT BEKASI", 86, "", 208]);

    // Truncate the worksheet
    const result = await truncateWorksheetRows(workbook);

    // Verify that the correct rows were removed
    expect(result.worksheets[0]!.rowCount).toBe(4);
    expect(result.worksheets[0]!.getRow(1).getCell(1).value).toBe("TGL");
    expect(result.worksheets[0]!.getRow(2).getCell(1).value).toBe("9/9/2016");
  });

  it("should not remove any rows if no date is found", async () => {
    // Create a worksheet with sample data without a date row
    const worksheet = workbook.addWorksheet("Test");
    worksheet.addRow(["NAMA BARANG : HOLLOW 50x10x4M DINDING", "", "", "", ""]);
    worksheet.addRow(["", "", "", "", ""]);
    worksheet.addRow(["TGL", "KETERANGAN", "MASUK", "KELUAR", "SISA"]);
    worksheet.addRow(["No Date", "Entry 1", 10, "", 10]);
    worksheet.addRow(["No Date", "Entry 2", 20, "", 30]);
    worksheet.addRow(["No Date", "Entry 3", 30, "", 60]);

    // Truncate the worksheet
    const result = await truncateWorksheetRows(workbook);

    // Verify that no rows were removed
    expect(result.worksheets[0]!.rowCount).toBe(6);
  });

  it("should handle multiple worksheets", async () => {
    // Create two worksheets with sample data
    const worksheet1 = workbook.addWorksheet("Sheet1");
    worksheet1.addRow([
      "NAMA BARANG : HOLLOW 50x10x4M DINDING",
      "",
      "",
      "",
      "",
    ]);
    worksheet1.addRow(["", "", "", "", ""]);
    worksheet1.addRow(["TGL", "KETERANGAN", "MASUK", "KELUAR", "SISA"]);
    worksheet1.addRow(["9/9/2016", "JAGAT-BEKASI", 84, "", 84]);
    worksheet1.addRow(["9/9/2016", "JAGAT-BEKASI", 38, "", 122]);
    worksheet1.addRow(["14/9/16", "JAGAT BEKASI", 86, "", 208]);

    const worksheet2 = workbook.addWorksheet("Sheet2");
    worksheet2.addRow([
      "NAMA BARANG : HOLLOW 50x10x4M DINDING",
      "",
      "",
      "",
      "",
    ]);
    worksheet2.addRow(["", "", "", "", ""]);
    worksheet2.addRow(["TGL", "KETERANGAN", "MASUK", "KELUAR", "SISA"]);
    worksheet2.addRow(["1/1/2023", "Supplier A", 50, "", 50]);
    worksheet2.addRow(["2/1/2023", "Supplier B", 30, "", 80]);
    worksheet2.addRow(["3/1/2023", "Supplier C", 20, "", 100]);

    // Truncate the workbook
    const result = await truncateWorksheetRows(workbook);

    // Verify that the correct rows were removed from each worksheet
    expect(result.worksheets[0]!.rowCount).toBe(4);
    expect(result.worksheets[1]!.rowCount).toBe(4);
  });

  it("should remove rows above the first date row even if there is no 'TGL' row", async () => {
    // Create a worksheet with sample data without a 'TGL' row
    const worksheet = workbook.addWorksheet("Test");
    worksheet.addRow(["NAMA BARANG : HOLLOW 50x10x4M DINDING", "", "", "", ""]);
    worksheet.addRow(["", "", "", "", ""]);
    worksheet.addRow(["Date", "Keterangan", "Masuk", "Keluar", "Sisa"]);
    worksheet.addRow(["9/9/2016", "JAGAT-BEKASI", 84, "", 84]);
    worksheet.addRow(["9/9/2016", "JAGAT-BEKASI", 38, "", 122]);
    worksheet.addRow(["14/9/16", "JAGAT BEKASI", 86, "", 208]);

    // Truncate the worksheet
    const result = await truncateWorksheetRows(workbook);

    // Verify that the correct rows were removed
    expect(result.worksheets[0]!.rowCount).toBe(4);
    expect(result.worksheets[0]!.getRow(1).getCell(1).value).toBe("Date");
    expect(result.worksheets[0]!.getRow(2).getCell(1).value).toBe("9/9/2016");
  });
});
