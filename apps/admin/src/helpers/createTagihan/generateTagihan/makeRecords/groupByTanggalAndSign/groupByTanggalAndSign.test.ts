import { ToReturn } from "../../generateTagihan";
import { groupByTanggalAndSign } from "./groupByTanggalAndSign";

describe("groupByTanggalAndSign", () => {
  // Mock data
  const mockInput: ToReturn = {
    alat1: {
      records: [
        {
          tanggal: "20/07/2023",
          jumlah: 5,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
        {
          tanggal: "21/07/2023",
          jumlah: -3,
          hargaBulanan: 50,
          hargaHarian: 1.67,
        },
      ],
    },
    alat2: {
      records: [
        {
          tanggal: "20/07/2023",
          jumlah: -4,
          hargaBulanan: 80,
          hargaHarian: 2.67,
        },
        { tanggal: "21/07/2023", jumlah: 6, hargaBulanan: 60, hargaHarian: 2 },
      ],
    },
  };

  // Expected result after grouping by tanggal and sign
  const expectedGroupedRecord = {
    alat1: {
      "20/07/2023-Sewa": [
        {
          tanggal: "20/07/2023",
          jumlah: 5,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
      ],
      "20/07/2023-Retur": undefined,
      "21/07/2023-Retur": [
        {
          tanggal: "21/07/2023",
          jumlah: -3,
          hargaBulanan: 50,
          hargaHarian: 1.67,
        },
      ],
      "21/07/2023-Sewa": undefined,
    },
    alat2: {
      "20/07/2023-Retur": [
        {
          tanggal: "20/07/2023",
          jumlah: -4,
          hargaBulanan: 80,
          hargaHarian: 2.67,
        },
      ],
      "20/07/2023-Sewa": undefined,
      "21/07/2023-Sewa": [
        { tanggal: "21/07/2023", jumlah: 6, hargaBulanan: 60, hargaHarian: 2 },
      ],
      "21/07/2023-Retur": undefined,
    },
  };

  it("should correctly group records by tanggal and sign and fill empty", () => {
    const result = groupByTanggalAndSign(mockInput);
    expect(result).toEqual(expectedGroupedRecord);
  });

  // Add more it cases to cover different scenarios
  it("should handle empty input", () => {
    const emptyInput: ToReturn = {};
    const result = groupByTanggalAndSign(emptyInput);
    expect(result).toEqual({});
  });

  it("should handle single alat with no records", () => {
    const singleAlatNoRecords: ToReturn = {
      alat1: {
        records: [],
      },
    };
    const result = groupByTanggalAndSign(singleAlatNoRecords);
    expect(result).toEqual({
      alat1: {},
    });
  });

  it("should handle single alat with records", () => {
    const singleAlatWithRecords: ToReturn = {
      alat1: {
        records: [
          {
            tanggal: "22/07/2023",
            jumlah: 1,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
          {
            tanggal: "23/07/2023",
            jumlah: -1,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
        ],
      },
    };
    const result = groupByTanggalAndSign(singleAlatWithRecords);
    expect(result).toEqual({
      alat1: {
        "22/07/2023-Sewa": [
          {
            tanggal: "22/07/2023",
            jumlah: 1,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
        ],
        "22/07/2023-Retur": undefined,
        "23/07/2023-Retur": [
          {
            tanggal: "23/07/2023",
            jumlah: -1,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
        ],
        "23/07/2023-Sewa": undefined,
      },
    });
  });

  it("should throw an error if there are records in the same alat with the same date", () => {
    const singleAlatWithRecords: ToReturn = {
      alat1: {
        records: [
          {
            tanggal: "22/07/2023",
            jumlah: 1,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
          {
            tanggal: "22/07/2023",
            jumlah: -1,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
        ],
      },
    };

    expect(() => groupByTanggalAndSign(singleAlatWithRecords)).toThrow();
  });
});
