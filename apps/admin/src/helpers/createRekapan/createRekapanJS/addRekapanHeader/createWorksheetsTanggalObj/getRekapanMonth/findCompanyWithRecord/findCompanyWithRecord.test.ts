import { RekapanWorkbookBody } from "../../../../../types";
import { findCompanyWithRecord } from "./findCompanyWithRecord";

describe("findCompanyWithRecord", () => {
  it("should return the company name with non-empty records", () => {
    const data: RekapanWorkbookBody = {
      CompanyA: {
        records: [
          {
            tanggal: "01/07/2023",
            stokDifference: 10,
            masuk: 5,
            keluar: 5,
            alatName: "AlatA",
            companyName: "CompanyA",
          },
        ],
      },
      CompanyB: {
        records: [
          {
            tanggal: "01/07/2023",
            stokDifference: 20,
            masuk: 10,
            keluar: 10,
            alatName: "AlatB",
            companyName: "CompanyB",
          },
        ],
      },
    };

    const result = findCompanyWithRecord(data);
    expect(result).toBe("CompanyA");
  });

  it("should throw an error if all companies have empty records", () => {
    const data: RekapanWorkbookBody = {
      CompanyA: {
        records: [],
      },
      CompanyB: {
        records: [],
      },
    };

    expect(() => findCompanyWithRecord(data)).toThrow(
      "No company found with non-empty records."
    );
  });

  it("should return the company name if all records are non-empty", () => {
    const data: RekapanWorkbookBody = {
      CompanyA: {
        records: [
          {
            tanggal: "01/07/2023",
            stokDifference: 10,
            masuk: 5,
            keluar: 5,
            alatName: "AlatA",
            companyName: "CompanyA",
          },
        ],
      },
      CompanyB: {
        records: [
          {
            tanggal: "01/07/2023",
            stokDifference: 20,
            masuk: 10,
            keluar: 10,
            alatName: "AlatB",
            companyName: "CompanyB",
          },
        ],
      },
    };

    const result = findCompanyWithRecord(data);
    expect(result).toBe("CompanyA"); // CompanyA is found first, hence returned
  });
});
