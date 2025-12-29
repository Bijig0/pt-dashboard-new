import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { RekapanWorkbookBody } from "../../../../types";
import { getRekapanMonth } from "./getRekapanMonth";

dayjs.extend(utc);

describe("getRekapanMonth", () => {
  it("should return the correct month for a valid input", () => {
    const input: RekapanWorkbookBody = {
      "Company A": {
        records: [
          {
            tanggal: "03/12/2024",
            stokDifference: 10,
            masuk: 20,
            keluar: 10,
            alatName: "Tool A",
            companyName: "Company A",
          },
        ],
      },
    };

    expect(getRekapanMonth(input)).toBe(11); // December is month 11 in zero-based indexing
  });

  it("should handle different months correctly", () => {
    const input: RekapanWorkbookBody = {
      "Company B": {
        records: [
          {
            tanggal: "01/12/2024",
            stokDifference: 5,
            masuk: 15,
            keluar: 10,
            alatName: "Tool B",
            companyName: "Company B",
          },
        ],
      },
    };

    expect(getRekapanMonth(input)).toBe(11); // December is month 11 in zero-based indexing
  });

  it("should handle an input with multiple companies and dates", () => {
    const input: RekapanWorkbookBody = {
      "Company A": {
        records: [
          {
            tanggal: "05/10/2024",
            stokDifference: 10,
            masuk: 20,
            keluar: 10,
            alatName: "Tool A",
            companyName: "Company A",
          },
        ],
      },
      "Company B": {
        records: [
          {
            tanggal: "15/10/2024",
            stokDifference: 5,
            masuk: 15,
            keluar: 10,
            alatName: "Tool B",
            companyName: "Company B",
          },
        ],
      },
    };

    expect(getRekapanMonth(input)).toBe(9); // October is month 9 in zero-based indexing
  });

  it("should throw an error for an empty input", () => {
    const input: RekapanWorkbookBody = {};

    expect(() => getRekapanMonth(input)).toThrow();
  });

  it("should throw an error for an input with empty records", () => {
    const input: RekapanWorkbookBody = {
      "Company A": {
        records: [],
      },
    };

    expect(() => getRekapanMonth(input)).toThrow();
  });
});
