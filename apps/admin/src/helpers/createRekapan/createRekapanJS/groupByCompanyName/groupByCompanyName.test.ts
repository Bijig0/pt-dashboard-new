import { CompanyName } from "../../types";
import { groupByCompanyName } from "./groupByCompanyName";

describe("groupByCompanyName", () => {
  it("should group records by company name", () => {
    const records = [
      { companyName: "CompanyA", data: 1 },
      { companyName: "CompanyB", data: 2 },
      { companyName: "CompanyA", data: 3 },
      { companyName: "CompanyC", data: 4 },
      { companyName: "CompanyB", data: 5 },
    ];

    const expected: Record<CompanyName, typeof records> = {
      CompanyA: [
        { companyName: "CompanyA", data: 1 },
        { companyName: "CompanyA", data: 3 },
      ],
      CompanyB: [
        { companyName: "CompanyB", data: 2 },
        { companyName: "CompanyB", data: 5 },
      ],
      CompanyC: [{ companyName: "CompanyC", data: 4 }],
    };

    const result = groupByCompanyName(records);
    expect(result).toEqual(expected);
  });

  it("should handle an empty array of records", () => {
    const records: { companyName: string }[] = [];

    const expected: Record<CompanyName, typeof records> = {};

    const result = groupByCompanyName(records);
    expect(result).toEqual(expected);
  });

  it("should handle records with only one company name", () => {
    const records = [
      { companyName: "CompanyA", data: 1 },
      { companyName: "CompanyA", data: 2 },
      { companyName: "CompanyA", data: 3 },
    ];

    const expected: Record<CompanyName, typeof records> = {
      CompanyA: [
        { companyName: "CompanyA", data: 1 },
        { companyName: "CompanyA", data: 2 },
        { companyName: "CompanyA", data: 3 },
      ],
    };

    const result = groupByCompanyName(records);
    expect(result).toEqual(expected);
  });

  it("should handle records with unique company names", () => {
    const records = [
      { companyName: "CompanyA", data: 1 },
      { companyName: "CompanyB", data: 2 },
      { companyName: "CompanyC", data: 3 },
    ];

    const expected: Record<CompanyName, typeof records> = {
      CompanyA: [{ companyName: "CompanyA", data: 1 }],
      CompanyB: [{ companyName: "CompanyB", data: 2 }],
      CompanyC: [{ companyName: "CompanyC", data: 3 }],
    };

    const result = groupByCompanyName(records);
    expect(result).toEqual(expected);
  });
});
