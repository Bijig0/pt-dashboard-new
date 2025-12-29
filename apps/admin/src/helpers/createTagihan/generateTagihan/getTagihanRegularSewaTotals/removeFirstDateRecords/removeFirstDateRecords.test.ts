import { Input } from "../../generateTagihan";
import { removeFirstDateRecords } from "./removeFirstDateRecords";

describe("removeFirstDateRecords", () => {
  it("should remove records where tanggal is the first date of the month", () => {
    const records: Input = [
      { tanggal: "01/07/2024", alatRecords: [] },
      { tanggal: "02/07/2024", alatRecords: [] },
    ];

    const expected: Input = [{ tanggal: "02/07/2024", alatRecords: [] }];

    expect(removeFirstDateRecords(records)).toEqual(expected);
  });

  it("should return an empty array if all records are on the first date of the month", () => {
    const records: Input = [{ tanggal: "01/07/2024", alatRecords: [] }];

    const expected: Input = [];

    expect(removeFirstDateRecords(records)).toEqual(expected);
  });

  it("should return the same array if no records are on the first date of the month", () => {
    const records: Input = [
      { tanggal: "02/07/2024", alatRecords: [] },
      { tanggal: "15/08/2024", alatRecords: [] },
    ];

    const expected: Input = [
      { tanggal: "02/07/2024", alatRecords: [] },
      { tanggal: "15/08/2024", alatRecords: [] },
    ];

    expect(removeFirstDateRecords(records)).toEqual(expected);
  });

  it("should handle an empty array input", () => {
    const records: Input = [];

    const expected: Input = [];

    expect(removeFirstDateRecords(records)).toEqual(expected);
  });
});
