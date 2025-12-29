// @ts-nocheck
import { GroupedRecord } from "../../../generateTagihan";
import { fillEmpty } from "./fillEmpty";

describe("fillEmpty", () => {
  it("should fill empty inverse rent types", () => {
    const input: GroupedRecord = {
      Alat1: {
        "01/07/2023-Sewa": [{ tanggal: "01/07/2023", jumlah: 2, harga: 100 }],
        "02/07/2023-Retur": [{ tanggal: "02/07/2023", jumlah: -1, harga: 100 }],
      },
      Alat2: {
        "01/07/2023-Sewa": [{ tanggal: "01/07/2023", jumlah: 3, harga: 200 }],
      },
    };

    const expected: GroupedRecord = {
      Alat1: {
        "01/07/2023-Sewa": [{ tanggal: "01/07/2023", jumlah: 2, harga: 100 }],
        "01/07/2023-Retur": undefined,
        "02/07/2023-Retur": [{ tanggal: "02/07/2023", jumlah: -1, harga: 100 }],
        "02/07/2023-Sewa": undefined,
      },
      Alat2: {
        "01/07/2023-Sewa": [{ tanggal: "01/07/2023", jumlah: 3, harga: 200 }],
        "01/07/2023-Retur": undefined,
      },
    };

    const result = fillEmpty(input);
    expect(result).toEqual(expected);
  });

  it("should handle empty input", () => {
    const input: GroupedRecord = {};
    const expected: GroupedRecord = {};
    const result = fillEmpty(input);
    expect(result).toEqual(expected);
  });

  it("should throw an error if there are multiple Sewa AND Retur records for the same date for the same alat", () => {
    const input: GroupedRecord = {
      Alat1: {
        "01/07/2023-Sewa": [{ tanggal: "01/07/2023", jumlah: 2, harga: 100 }],
        "01/07/2023-Retur": [{ tanggal: "01/07/2023", jumlah: -1, harga: 100 }],
      },
    };

    expect(() => fillEmpty(input)).toThrow();
  });

  it("should handle input with multiple alat and dates", () => {
    const input: GroupedRecord = {
      Alat1: {
        "01/07/2023-Sewa": [{ tanggal: "01/07/2023", jumlah: 2, harga: 100 }],
        "02/07/2023-Retur": [{ tanggal: "02/07/2023", jumlah: -1, harga: 100 }],
      },
      Alat2: {
        "01/07/2023-Retur": [{ tanggal: "01/07/2023", jumlah: -3, harga: 200 }],
        "03/07/2023-Sewa": [{ tanggal: "03/07/2023", jumlah: 4, harga: 200 }],
      },
    };

    const expected: GroupedRecord = {
      Alat1: {
        "01/07/2023-Sewa": [{ tanggal: "01/07/2023", jumlah: 2, harga: 100 }],
        "01/07/2023-Retur": undefined,
        "02/07/2023-Retur": [{ tanggal: "02/07/2023", jumlah: -1, harga: 100 }],
        "02/07/2023-Sewa": undefined,
      },
      Alat2: {
        "01/07/2023-Retur": [{ tanggal: "01/07/2023", jumlah: -3, harga: 200 }],
        "01/07/2023-Sewa": undefined,
        "03/07/2023-Sewa": [{ tanggal: "03/07/2023", jumlah: 4, harga: 200 }],
        "03/07/2023-Retur": undefined,
      },
    };

    const result = fillEmpty(input);
    expect(result).toEqual(expected);
  });
});
