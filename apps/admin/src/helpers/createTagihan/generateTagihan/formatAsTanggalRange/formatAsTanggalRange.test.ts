import { formatAsTanggalRange } from "./formatAsTanggalRange";

describe("formatAsTanggalRange", () => {
  it("should correctly format a single alat with Sewa record", () => {
    const input = {
      "Alat 1": {
        "Alat 1-Sewa": [
          {
            tanggal: "15/07/2024",
            jumlah: 5,
            hargaBulanan: 100000,
            hargaHarian: 3333.33,
          },
        ],
      },
    };

    const result = formatAsTanggalRange(input);

    expect(result).toEqual({
      "Alat 1": {
        records: [
          {
            jumlah: 5,
            days: 17, // 17 days until end of July
            tanggalRange: {
              start: "15/07/2024",
              end: "31/07/2024",
            },
          },
        ],
        hargaBulanan: 100000,
        hargaHarian: 3333.33,
      },
    });
  });

  it("should correctly format a single alat with Retur record", () => {
    const input = {
      "Alat 2": {
        "Alat 2-Retur": [
          {
            tanggal: "20/07/2024",
            jumlah: 3,
            hargaBulanan: 80000,
            hargaHarian: 2666.67,
          },
        ],
      },
    };

    const result = formatAsTanggalRange(input);

    expect(result).toEqual({
      "Alat 2": {
        records: [
          {
            jumlah: 3,
            days: 20, // 20 days from start of July
            tanggalRange: {
              start: "01/07/2024",
              end: "20/07/2024",
            },
          },
        ],
        hargaBulanan: 80000,
        hargaHarian: 2666.67,
      },
    });
  });

  it("should handle multiple alat with multiple records", () => {
    const input = {
      "Alat 3": {
        "Alat 3-Sewa": [
          {
            tanggal: "10/07/2024",
            jumlah: 2,
            hargaBulanan: 50000,
            hargaHarian: 1666.67,
          },
        ],
        "Alat 3-Retur": [
          {
            tanggal: "25/07/2024",
            jumlah: -1,
            hargaBulanan: 50000,
            hargaHarian: 1666.67,
          },
        ],
      },
      "Alat 4": {
        "Alat 4-Sewa": [
          {
            tanggal: "05/07/2024",
            jumlah: 3,
            hargaBulanan: 75000,
            hargaHarian: 3333.33,
          },
        ],
      },
    };

    const result = formatAsTanggalRange(input);

    expect(result).toEqual({
      "Alat 3": {
        records: [
          {
            jumlah: 2,
            days: 22, // 22 days until end of July
            tanggalRange: {
              start: "10/07/2024",
              end: "31/07/2024",
            },
          },
          {
            jumlah: -1,
            days: 25, // 25 days from start of July
            tanggalRange: {
              start: "01/07/2024",
              end: "25/07/2024",
            },
          },
        ],
        hargaBulanan: 50000,
        hargaHarian: 1666.67,
      },
      "Alat 4": {
        records: [
          {
            jumlah: 3,
            days: 27, // 27 days until end of July
            tanggalRange: {
              start: "05/07/2024",
              end: "31/07/2024",
            },
          },
        ],
        hargaBulanan: 75000,
        hargaHarian: 3333.33,
      },
    });
  });

  it("should handle empty input", () => {
    const input = {};

    const result = formatAsTanggalRange(input);

    expect(result).toEqual({});
  });

  it("should handle dates at the start and end of the month", () => {
    const input = {
      "Alat 5": {
        "Alat 5-Sewa": [
          {
            tanggal: "01/07/2024",
            jumlah: 2,
            hargaBulanan: 60000,
            hargaHarian: 1666.67,
          },
        ],
        "Alat 5-Retur": [
          {
            tanggal: "31/07/2024",
            jumlah: -2,
            hargaBulanan: 60000,
            hargaHarian: 1666.67,
          },
        ],
      },
    };

    const result = formatAsTanggalRange(input);

    expect(result).toEqual({
      "Alat 5": {
        records: [
          {
            jumlah: 2,
            days: 31, // Full month for Sewa
            tanggalRange: {
              start: "01/07/2024",
              end: "31/07/2024",
            },
          },
          {
            jumlah: -2,
            days: 31, // Full month for Retur
            tanggalRange: {
              start: "01/07/2024",
              end: "31/07/2024",
            },
          },
        ],
        hargaBulanan: 60000,
        hargaHarian: 1666.67,
      },
    });
  });
});
