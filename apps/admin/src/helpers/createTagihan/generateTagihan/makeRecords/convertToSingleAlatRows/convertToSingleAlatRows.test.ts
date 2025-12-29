import { Input, ToReturn } from "../../generateTagihan";
import { convertToSingleAlatRows } from "./convertToSingleAlatRows";

describe("convertToSingleAlatRows", () => {
  it("should convert input to single alat rows", () => {
    const input: Input = [
      {
        tanggal: "01/07/2023",
        alatRecords: [
          { alatName: "Alat1", jumlahAlat: 2, hargaBulanan: 100, hargaHarian: 3.33 },
          { alatName: "Alat2", jumlahAlat: 1, hargaBulanan: 200, hargaHarian: 6.67 },
        ],
      },
      {
        tanggal: "02/07/2023",
        alatRecords: [
          { alatName: "Alat1", jumlahAlat: 3, hargaBulanan: 100, hargaHarian: 3.33 },
          { alatName: "Alat3", jumlahAlat: 1, hargaBulanan: 300, hargaHarian: 10 },
        ],
      },
    ];

    const expectedOutput: ToReturn = {
      Alat1: {
        records: [
          { tanggal: "01/07/2023", jumlah: 2, hargaBulanan: 100, hargaHarian: 3.33 },
          { tanggal: "02/07/2023", jumlah: 3, hargaBulanan: 100, hargaHarian: 3.33 },
        ],
      },
      Alat2: {
        records: [{ tanggal: "01/07/2023", jumlah: 1, hargaBulanan: 200, hargaHarian: 6.67 }],
      },
      Alat3: {
        records: [{ tanggal: "02/07/2023", jumlah: 1, hargaBulanan: 300, hargaHarian: 10 }],
      },
    };

    const result = convertToSingleAlatRows(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should return an empty object for empty input", () => {
    const input: Input = [];
    const expectedOutput: ToReturn = {};

    const result = convertToSingleAlatRows(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should handle input with a single row and single alat", () => {
    const input: Input = [
      {
        tanggal: "01/07/2023",
        alatRecords: [{ alatName: "Alat1", jumlahAlat: 2, hargaBulanan: 100, hargaHarian: 3.33 }],
      },
    ];

    const expectedOutput: ToReturn = {
      Alat1: {
        records: [{ tanggal: "01/07/2023", jumlah: 2, hargaBulanan: 100, hargaHarian: 3.33 }],
      },
    };

    const result = convertToSingleAlatRows(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should handle input with multiple rows but same alat", () => {
    const input: Input = [
      {
        tanggal: "01/07/2023",
        alatRecords: [{ alatName: "Alat1", jumlahAlat: 2, hargaBulanan: 100, hargaHarian: 3.33 }],
      },
      {
        tanggal: "02/07/2023",
        alatRecords: [{ alatName: "Alat1", jumlahAlat: 3, hargaBulanan: 100, hargaHarian: 3.33 }],
      },
    ];

    const expectedOutput: ToReturn = {
      Alat1: {
        records: [
          { tanggal: "01/07/2023", jumlah: 2, hargaBulanan: 100, hargaHarian: 3.33 },
          { tanggal: "02/07/2023", jumlah: 3, hargaBulanan: 100, hargaHarian: 3.33 },
        ],
      },
    };

    const result = convertToSingleAlatRows(input);
    expect(result).toEqual(expectedOutput);
  });
});
