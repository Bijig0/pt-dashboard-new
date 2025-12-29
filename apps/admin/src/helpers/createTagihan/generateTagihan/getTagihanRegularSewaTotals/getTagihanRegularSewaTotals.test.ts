import { Input } from "../generateTagihan";
import { getTagihanRegularSewaTotals } from "./getTagihanRegularSewaTotals";

describe("getTagihanRegularSewaTotals", () => {
  const mockData: Input = [
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

  const expectedOutput = {
    Alat1: {
      records: [
        {
          jumlah: 5,
          days: 12, // Days from 20/07/2023 to end of month
          tanggalRange: {
            start: "20/07/2023",
            end: "31/07/2023",
          },
        },
        {
          jumlah: 3,
          days: 21, // Days from start of month to 21/07/2023
          tanggalRange: {
            start: "01/07/2023",
            end: "21/07/2023",
          },
        },
      ],
      hargaBulanan: 50, // harga from the last record
      hargaHarian: 1.67,
    },
    Alat2: {
      records: [
        {
          jumlah: 4,
          days: 20, // Days from start of month to 20/07/2023
          tanggalRange: {
            start: "01/07/2023",
            end: "20/07/2023",
          },
        },
        {
          jumlah: 6,
          days: 11, // Days from 21/07/2023 to end of month
          tanggalRange: {
            start: "21/07/2023",
            end: "31/07/2023",
          },
        },
      ],
      hargaBulanan: 60, // harga from the last record
      hargaHarian: 2,
    },
  };

  it("should correctly process records and format them as tanggal range", () => {
    const result = getTagihanRegularSewaTotals(mockData);
    expect(result).toEqual(expectedOutput);
  });

  it("should handle empty input", () => {
    const emptyInput: Input = [];
    const expectedEmptyOutput = {};

    const result = getTagihanRegularSewaTotals(emptyInput);
    expect(result).toEqual(expectedEmptyOutput);
  });

  it("should throw an error if given a record for a date with multiple same alats", () => {
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

    expect(() => getTagihanRegularSewaTotals(singleAlatInput)).toThrow();
  });

  it.todo("should handle dates at the end of month");

  it("should leave all the records with negative jumlahs as positive", () => {
    const input: Input = [
      {
        tanggal: "02/07/2023",
        alatRecords: [
          {
            alatName: "Alat1",
            jumlahAlat: -2,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
        ],
      },
    ];

    const expectedOutput = {
      Alat1: {
        records: [
          {
            jumlah: 2, // Jumlah is positive here
            days: 2,
            tanggalRange: {
              start: "01/07/2023",
              end: "02/07/2023",
            },
          },
        ],
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
    };

    const result = getTagihanRegularSewaTotals(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should mke the range of dates for the negative jumlahs as from start of month to the set date", () => {
    const input: Input = [
      {
        tanggal: "02/07/2023",
        alatRecords: [
          {
            alatName: "Alat1",
            jumlahAlat: -2,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
        ],
      },
    ];

    const expectedOutput = {
      Alat1: {
        records: [
          {
            jumlah: 2, // Jumlah is positive here
            days: 2,
            tanggalRange: {
              start: "01/07/2023",
              end: "02/07/2023",
            },
          },
        ],
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
    };

    const result = getTagihanRegularSewaTotals(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should not add the first date amount to regular sewa totals", () => {
    const input: Input = [
      {
        tanggal: "01/07/2023",
        alatRecords: [
          {
            alatName: "Alat1",
            jumlahAlat: 2,
            hargaBulanan: 60,
            hargaHarian: 2,
          },
        ],
      },
    ];

    const expectedOutput = {};

    const result = getTagihanRegularSewaTotals(input);
    expect(result).toEqual(expectedOutput);
  });
});
