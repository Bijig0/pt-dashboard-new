import { findExcelCompanyNamesNotInDatabaseCompanyNames } from "./findExcelCompanyNamesNotInDatabaseCompanyNames";

describe("findExcelCompanyNamesNotInDatabaseCompanyNames", () => {
  it("should return an empty array when all Excel company names are in the database", () => {
    const excelFileCompanyNames = ["Company A", "Company B", "Company C"];
    const databaseCompanyNames = [
      "Company A",
      "Company B",
      "Company C",
      "Company D",
    ];

    const result = findExcelCompanyNamesNotInDatabaseCompanyNames({
      excelFileCompanyNames,
      databaseCompanyNames,
    });

    expect(result).toEqual([]);
  });

  it("should return company names that are in Excel file but not in the database", () => {
    const excelFileCompanyNames = [
      "Company A",
      "Company B",
      "Company C",
      "Company D",
      "Company E",
    ];
    const databaseCompanyNames = ["Company A", "Company C", "Company E"];

    const result = findExcelCompanyNamesNotInDatabaseCompanyNames({
      excelFileCompanyNames,
      databaseCompanyNames,
    });

    expect(result).toEqual(["Company B", "Company D"]);
  });

  it("should handle empty Excel company names array", () => {
    const excelFileCompanyNames: string[] = [];
    const databaseCompanyNames = ["Company A", "Company B", "Company C"];

    const result = findExcelCompanyNamesNotInDatabaseCompanyNames({
      excelFileCompanyNames,
      databaseCompanyNames,
    });

    expect(result).toEqual([]);
  });

  it("should handle empty database company names array", () => {
    const excelFileCompanyNames = ["Company A", "Company B", "Company C"];
    const databaseCompanyNames: string[] = [];

    const result = findExcelCompanyNamesNotInDatabaseCompanyNames({
      excelFileCompanyNames,
      databaseCompanyNames,
    });

    expect(result).toEqual(["Company A", "Company B", "Company C"]);
  });

  it("should handle case-sensitive comparisons", () => {
    const excelFileCompanyNames = ["Company A", "company b", "COMPANY C"];
    const databaseCompanyNames = ["Company A", "Company B", "Company C"];

    const result = findExcelCompanyNamesNotInDatabaseCompanyNames({
      excelFileCompanyNames,
      databaseCompanyNames,
    });

    expect(result).toEqual(["company b", "COMPANY C"]);
  });
});
