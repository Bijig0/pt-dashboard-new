import { GroupedRecord } from "../../../../generateTagihan";
import { isValidGroupedRecord } from "./isValidGroupedRecord";

describe("isValidGroupedRecord", () => {
  it("should allow dates where there is only a single retur OR a single sewa", () => {
    const validRecord: GroupedRecord = {
      Alat1: {
        "10/10/2024-Retur": [{ tanggal: "10/10/2024", jumlah: -1, hargaBulanan: 100, hargaHarian: 3.33 }],
        "11/10/2024-Sewa": [{ tanggal: "11/10/2024", jumlah: 2, hargaBulanan: 100, hargaHarian: 3.33 }],
      },
      Alat2: {
        "10/10/2024-Sewa": [{ tanggal: "10/10/2024", jumlah: 3, hargaBulanan: 200, hargaHarian: 6.67 }],
      },
    };
    expect(isValidGroupedRecord(validRecord)).toBe(true);
  });

  it("should return false for an alat containing reocrds that have the same date with a retur AND a sewa", () => {
    const invalidRecord: GroupedRecord = {
      Alat1: {
        "10/10/2024-Retur": [{ tanggal: "10/10/2024", jumlah: -1, hargaBulanan: 100, hargaHarian: 3.33 }],
        "10/10/2024-Sewa": [{ tanggal: "10/10/2024", jumlah: 2, hargaBulanan: 100, hargaHarian: 3.33 }],
      },
    };
    expect(isValidGroupedRecord(invalidRecord)).toBe(false);
  });

  it("should return true for an empty record", () => {
    const emptyRecord: GroupedRecord = {};
    expect(isValidGroupedRecord(emptyRecord)).toBe(true);
  });

  it("should return true for a record with empty Alat records", () => {
    const recordWithEmptyAlat: GroupedRecord = {
      Alat1: {},
      Alat2: {},
    };
    expect(isValidGroupedRecord(recordWithEmptyAlat)).toBe(true);
  });

  it("should return true for a record with same dates across different Alat", () => {
    const validRecordWithSameDates: GroupedRecord = {
      Alat1: {
        "10/10/2024-Retur": [{ tanggal: "10/10/2024", jumlah: -1, hargaBulanan: 100, hargaHarian: 3.33 }],
      },
      Alat2: {
        "10/10/2024-Sewa": [{ tanggal: "10/10/2024", jumlah: 3, hargaBulanan: 200, hargaHarian: 6.67 }],
      },
    };
    expect(isValidGroupedRecord(validRecordWithSameDates)).toBe(true);
  });

  it("should throw an error for a record with invalid date format", () => {
    const invalidDateFormatRecord: GroupedRecord = {
      Alat1: {
        "InvalidDate-Retur": [
          { tanggal: "InvalidDate", jumlah: -1, hargaBulanan: 100, hargaHarian: 3.33 },
        ],
      },
    };
    expect(() => isValidGroupedRecord(invalidDateFormatRecord)).toThrow(
      "Date is undefined"
    );
  });
});
