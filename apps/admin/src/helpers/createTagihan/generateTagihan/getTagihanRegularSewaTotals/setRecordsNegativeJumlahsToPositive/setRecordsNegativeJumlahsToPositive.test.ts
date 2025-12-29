import { GroupedRecord } from "../../generateTagihan";
import { setRecordsNegativeJumlahsToPositive } from "./setRecordsNegativeJumlahsToPositive";

describe("setRecordsNegativeJumlahsToPositive", () => {
  test("should set negative jumlah to positive", () => {
    const records: GroupedRecord = {
      Alat1: {
        "2023-Sewa": [
          {
            tanggal: "2023-07-01",
            jumlah: -10,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
          {
            tanggal: "2023-07-02",
            jumlah: 5,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
        ],
      },
    };

    const result = setRecordsNegativeJumlahsToPositive(records);

    expect(result).toEqual({
      Alat1: {
        "2023-Sewa": [
          {
            tanggal: "2023-07-01",
            jumlah: 10,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
          {
            tanggal: "2023-07-02",
            jumlah: 5,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
        ],
      },
    });
  });

  test("should not change positive jumlah values", () => {
    const records: GroupedRecord = {
      Alat1: {
        "2023-Sewa": [
          {
            tanggal: "2023-07-01",
            jumlah: 10,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
          {
            tanggal: "2023-07-02",
            jumlah: 5,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
        ],
      },
    };

    const result = setRecordsNegativeJumlahsToPositive(records);

    expect(result).toEqual(records);
  });

  test("should handle multiple alat names and keys", () => {
    const records: GroupedRecord = {
      Alat1: {
        "2023-Sewa": [
          {
            tanggal: "2023-07-01",
            jumlah: -10,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
        ],
        "2023-Retur": [
          {
            tanggal: "2023-07-03",
            jumlah: -20,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
        ],
      },
      Alat2: {
        "2023-Sewa": [
          {
            tanggal: "2023-07-01",
            jumlah: -5,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
        ],
      },
    };

    const result = setRecordsNegativeJumlahsToPositive(records);

    expect(result).toEqual({
      Alat1: {
        "2023-Sewa": [
          {
            tanggal: "2023-07-01",
            jumlah: 10,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
        ],
        "2023-Retur": [
          {
            tanggal: "2023-07-03",
            jumlah: 20,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
        ],
      },
      Alat2: {
        "2023-Sewa": [
          {
            tanggal: "2023-07-01",
            jumlah: 5,
            hargaBulanan: 1000,
            hargaHarian: 50,
          },
        ],
      },
    });
  });

  test("should handle undefined records", () => {
    const records: GroupedRecord = {
      Alat1: {
        "2023-Sewa": undefined,
      },
    };

    const result = setRecordsNegativeJumlahsToPositive(records);

    expect(result).toEqual({
      Alat1: {
        "2023-Sewa": undefined,
      },
    });
  });

  test("The alat should have records, but inside the records, there can be undefined", () => {
    const records: GroupedRecord = {
      // @ts-ignore
      Alat1: undefined,
    };

    expect(() => setRecordsNegativeJumlahsToPositive(records)).toThrow();
  });

  test("should handle empty records", () => {
    const records: GroupedRecord = {};

    const result = setRecordsNegativeJumlahsToPositive(records);

    expect(result).toEqual({});
  });
});
