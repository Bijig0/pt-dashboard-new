import ExcelJS from "exceljs";
import { COMPANY_NAME_NOT_STRING_ERROR_MESSAGE } from "../stok-alat-schema/stok-alat-schema";
import { findStokAlatDataErrors } from "./find-stok-alat-data-errors";

const allowedCompanyNames = [
  "Company A",
  "Company B",
  "Company C",
  "Company D",
];

describe("findStokAlatDataErrors", () => {
  let workbook: ExcelJS.Workbook;

  beforeEach(() => {
    workbook = new ExcelJS.Workbook();
  });

  it("should have mutually exclusive masuk and keluar rows", async () => {
    const worksheet = workbook.addWorksheet("Sheet1");
    const headerRow = ["tanggal", "companyName", "masuk", "keluar"];
    worksheet.addRow(headerRow);
    worksheet.addRow([new Date(), "Company A", 10, 20]);
    worksheet.addRow([new Date(), "Company C", undefined, 40]);
    worksheet.addRow([new Date(), "Company B", 30, 40]);
    worksheet.addRow([new Date(), "Company D", undefined, 40]);

    const { errors } = await findStokAlatDataErrors({
      workbook,
      allowedCompanyNames,
    });

    expect(errors).toEqual([
      {
        worksheetName: "Sheet1",
        rowNumber: 2,
        errorMessage:
          "Either the third or fourth element must be a number, but not both",
      },
      {
        worksheetName: "Sheet1",
        rowNumber: 4,
        errorMessage:
          "Either the third or fourth element must be a number, but not both",
      },
    ]);
  });

  it("should ensure that the masuk or keluar cell (whichever one is filled) contains a number", async () => {
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.addRow(["tanggal", "companyName", "masuk", "keluar"]);
    worksheet.addRow([new Date(), "Company A", "invalid", null, 10]); // Invalid
    worksheet.addRow([new Date(), "Company B", null, "invalid"]); // Invalid
    worksheet.addRow([new Date(), "Company C", 30, null, 10]); // Valid
    worksheet.addRow([new Date(), "Company D", null, 40]); // Valid

    const { errors } = await findStokAlatDataErrors({
      workbook,
      allowedCompanyNames,
    });

    expect(errors).toEqual([
      {
        worksheetName: "Sheet1",
        rowNumber: 2,
        errorMessage: "Expected number, received string",
      },
      {
        worksheetName: "Sheet1",
        rowNumber: 3,
        errorMessage: "Expected number, received string",
      },
    ]);
  });

  it("should have all cells in a row filled (aside from the masuk and keluar which should be either or)", async () => {
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.addRow(["tanggal", "companyName", "masuk", "keluar"]);
    worksheet.addRow([new Date(), null, 10, null, 10]); // Invalid: company name missing
    worksheet.addRow([new Date(), "Company B", undefined, 40]); // Valid
    worksheet.addRow([new Date(), "Company C", 30, null, 10]); // Valid
    worksheet.addRow([null, "Company D", null, 40]); // Invalid: date missing

    const { errors } = await findStokAlatDataErrors({
      workbook,
      allowedCompanyNames,
    });

    expect(errors).toEqual([
      {
        worksheetName: "Sheet1",
        rowNumber: 2,
        errorMessage: COMPANY_NAME_NOT_STRING_ERROR_MESSAGE,
      },
      {
        worksheetName: "Sheet1",
        rowNumber: 5,
        errorMessage: "Required",
      },
    ]);
  });

  it("should have a date as the first cell", async () => {
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.addRow(["tanggal", "companyName", "masuk", "keluar"]);
    worksheet.addRow(["Invalid Date", "Company A", 10, null, 10]); // Invalid
    worksheet.addRow([new Date(), "Company B", null, 20, 10]); // Valid

    const { errors } = await findStokAlatDataErrors({
      workbook,
      allowedCompanyNames,
    });

    expect(errors).toEqual([
      {
        worksheetName: "Sheet1",
        rowNumber: 2,
        errorMessage: "Expected date, received string",
      },
    ]);
  });

  it("should have a string as the second cell", async () => {
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.addRow(["tanggal", "companyName", "masuk", "keluar"]);
    worksheet.addRow([new Date(), 123, 10, null, 50]); // Invalid
    worksheet.addRow([new Date(), "Company B", null, 20, 50]); // Valid

    const { errors } = await findStokAlatDataErrors({
      workbook,
      allowedCompanyNames,
    });

    expect(errors).toEqual([
      {
        worksheetName: "Sheet1",
        rowNumber: 2,
        errorMessage: COMPANY_NAME_NOT_STRING_ERROR_MESSAGE,
      },
    ]);
  });

  it("should have at least four columns", async () => {
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.addRow(["tanggal", "companyName", "masuk", "keluar"]);
    worksheet.addRow([new Date(), "Company A", 10]); // Invalid: only three columns
    worksheet.addRow([new Date(), "Company B", null, 20]); // Valid

    const { errors } = await findStokAlatDataErrors({
      workbook,
      allowedCompanyNames,
    });

    expect(errors).toEqual([
      {
        worksheetName: "Sheet1",
        rowNumber: 2,
        errorMessage: "Array must have at least 4 elements",
      },
    ]);
  });
});
