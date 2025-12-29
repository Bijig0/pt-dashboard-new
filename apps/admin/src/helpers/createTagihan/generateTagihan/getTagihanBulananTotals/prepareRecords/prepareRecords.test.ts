import { Input } from "../../generateTagihan";
import { prepareRecords } from "./prepareRecords";

describe("prepareRecords", () => {
  it("should process and convert records correctly", () => {
    const input: Input = [
      // first record will be sliced off
      {
        tanggal: "01/01/2023",
        alatRecords: [
          {
            alatName: "alat1",
            jumlahAlat: 5,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
        ],
      },
      {
        tanggal: "02/01/2023",
        alatRecords: [
          {
            alatName: "alat1",
            jumlahAlat: 3,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
          {
            alatName: "alat2",
            jumlahAlat: 7,
            hargaBulanan: 1500,
            hargaHarian: 70,
          },
        ],
      },
      {
        tanggal: "03/01/2023",
        alatRecords: [
          {
            alatName: "alat1",
            jumlahAlat: 2,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
          {
            alatName: "alat2",
            // @ts-ignore
            jumlahAlat: undefined,
            hargaBulanan: 1500,
            hargaHarian: 70,
          },
        ],
      },
    ];

    const expectedOutput = {
      alat1: {
        records: [
          {
            tanggal: "02/01/2023",
            jumlah: 3,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
          {
            tanggal: "03/01/2023",
            jumlah: 2,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
        ],
      },
      alat2: {
        records: [
          {
            tanggal: "02/01/2023",
            jumlah: 7,
            hargaBulanan: 1500,
            hargaHarian: 70,
          },
        ],
      },
    };

    expect(prepareRecords(input)).toEqual(expectedOutput);
  });

  it("should handle empty input", () => {
    const input: Input = [];

    const expectedOutput = {};

    expect(prepareRecords(input)).toEqual(expectedOutput);
  });

  it("should handle input with no alat records", () => {
    const input: Input = [
      { tanggal: "01/01/2023", alatRecords: [] },
      { tanggal: "02/01/2023", alatRecords: [] },
    ];

    const expectedOutput = {};

    expect(prepareRecords(input)).toEqual(expectedOutput);
  });

  it("should handle input with undefined jumlahAlat values", () => {
    const input: Input = [
      { tanggal: "01/01/2023", alatRecords: [] },
      {
        tanggal: "02/01/2023",
        alatRecords: [
          {
            alatName: "alat1",
            // @ts-ignore
            jumlahAlat: undefined,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
        ],
      },
    ];

    const expectedOutput = {
      alat1: {
        records: [],
      },
    };

    expect(prepareRecords(input)).toEqual(expectedOutput);
  });
});
