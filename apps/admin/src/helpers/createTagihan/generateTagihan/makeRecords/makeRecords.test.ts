import { GroupedRecord, Input } from "../generateTagihan";
import { makeRecords } from "./makeRecords";

describe("makeRecords", () => {
  const mockInput: Input = [
    {
      tanggal: "20/07/2023",
      alatRecords: [
        {
          alatName: "Alat1",
          jumlahAlat: 5,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
        {
          alatName: "Alat2",
          jumlahAlat: -4,
          hargaBulanan: 80,
          hargaHarian: 2.67,
        },
      ],
    },
    {
      tanggal: "21/07/2023",
      alatRecords: [
        {
          alatName: "Alat1",
          jumlahAlat: -3,
          hargaBulanan: 50,
          hargaHarian: 1.67,
        },
        { alatName: "Alat2", jumlahAlat: 6, hargaBulanan: 60, hargaHarian: 2 },
      ],
    },
  ];

  it("should correctly convert, filter, and group records", () => {
    const expectedGroupedRecord: GroupedRecord = {
      Alat1: {
        "20/07/2023-Sewa": [
          {
            tanggal: "20/07/2023",
            jumlah: 5,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
        ],
        "21/07/2023-Retur": [
          {
            tanggal: "21/07/2023",
            jumlah: 3,
            hargaBulanan: 50,
            hargaHarian: 1.67,
          },
        ],
      },
      Alat2: {
        "20/07/2023-Retur": [
          {
            tanggal: "20/07/2023",
            jumlah: 4,
            hargaBulanan: 80,
            hargaHarian: 2.67,
          },
        ],
        "21/07/2023-Sewa": [
          {
            tanggal: "21/07/2023",
            jumlah: 6,
            hargaBulanan: 60,
            hargaHarian: 2,
          },
        ],
      },
    };

    const result = makeRecords(mockInput);

    expect(result).toEqual(expectedGroupedRecord);
  });

  it("should handle empty input", () => {
    const emptyInput: Input = [];
    const expectedEmptyOutput: GroupedRecord = {};

    const result = makeRecords(emptyInput);

    expect(result).toEqual(expectedEmptyOutput);
  });

  it("should handle input with undefined jumlah", () => {
    const inputWithUndefinedJumlah: Input = [
      {
        tanggal: "20/07/2023",
        alatRecords: [
          // @ts-ignore
          { alatName: "Alat1", jumlahAlat: undefined, harga: 100 },
          {
            alatName: "Alat2",
            jumlahAlat: -4,
            hargaBulanan: 80,
            hargaHarian: 2.67,
          },
        ],
      },
      {
        tanggal: "21/07/2023",
        alatRecords: [
          {
            alatName: "Alat1",
            jumlahAlat: -3,
            hargaBulanan: 50,
            hargaHarian: 1.67,
          },
          {
            alatName: "Alat2",
            jumlahAlat: 6,
            hargaBulanan: 60,
            hargaHarian: 2,
          },
        ],
      },
    ];

    const expectedOutput: GroupedRecord = {
      Alat1: {
        "21/07/2023-Retur": [
          {
            tanggal: "21/07/2023",
            jumlah: 3,
            hargaBulanan: 50,
            hargaHarian: 1.67,
          },
        ],
      },
      Alat2: {
        "20/07/2023-Retur": [
          {
            tanggal: "20/07/2023",
            jumlah: 4,
            hargaBulanan: 80,
            hargaHarian: 2.67,
          },
        ],
        "21/07/2023-Sewa": [
          {
            tanggal: "21/07/2023",
            jumlah: 6,
            hargaBulanan: 60,
            hargaHarian: 2,
          },
        ],
      },
    };

    const result = makeRecords(inputWithUndefinedJumlah);

    expect(result).toEqual(expectedOutput);
  });

  it("should throw if given a record for a date with multiple same alats", () => {
    const singleAlatInput: Input = [
      {
        tanggal: "22/07/2023",
        alatRecords: [
          {
            alatName: "Alat1",
            jumlahAlat: 1,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
          {
            alatName: "Alat1",
            jumlahAlat: -1,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
        ],
      },
    ];

    expect(() => makeRecords(singleAlatInput)).toThrow();
  });
});
