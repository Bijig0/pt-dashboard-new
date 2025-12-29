import { convertCategorizedPricesIntoRows } from "./convertCategorizedPricesIntoRows"; // adjust the import path as needed

describe("convertCategorizedPricesIntoRows", () => {
  it("should convert present alats correctly", () => {
    const input = {
      "Prices Present Alats": [
        { name: "Alat1", harga_bulanan: 1000, harga_harian: 50 },
        { name: "Alat2", harga_bulanan: 2000, harga_harian: 100 },
      ],
      "Prices Missing Alats": [],
    };

    const expected = [
      {
        name: "Alat1",
        hargaBulanan: 1000,
        hargaHarian: 50,
        status: "present",
      },
      {
        name: "Alat2",
        hargaBulanan: 2000,
        hargaHarian: 100,
        status: "present",
      },
    ];

    expect(convertCategorizedPricesIntoRows(input)).toEqual(expected);
  });

  it("should convert missing alats correctly", () => {
    const input = {
      "Prices Present Alats": [],
      "Prices Missing Alats": ["Alat3", "Alat4"],
    };

    const expected = [
      {
        name: "Alat3",
        status: "missing",
      },
      {
        name: "Alat4",
        status: "missing",
      },
    ];

    expect(convertCategorizedPricesIntoRows(input)).toEqual(expected);
  });

  it("should handle a mix of present and missing alats", () => {
    const input = {
      "Prices Present Alats": [
        { name: "Alat1", harga_bulanan: 1000, harga_harian: 50 },
      ],
      "Prices Missing Alats": ["Alat2"],
    };

    const expected = [
      {
        name: "Alat1",
        hargaBulanan: 1000,
        hargaHarian: 50,
        status: "present",
      },
      {
        name: "Alat2",
        status: "missing",
      },
    ];

    expect(convertCategorizedPricesIntoRows(input)).toEqual(expected);
  });

  it("should handle empty input correctly", () => {
    const input = {
      "Prices Present Alats": [],
      "Prices Missing Alats": [],
    };

    expect(convertCategorizedPricesIntoRows(input)).toEqual([]);
  });

  it("should preserve the order of alats", () => {
    const input = {
      "Prices Present Alats": [
        { name: "Alat2", harga_bulanan: 2000, harga_harian: 100 },
        { name: "Alat1", harga_bulanan: 1000, harga_harian: 50 },
      ],
      "Prices Missing Alats": ["Alat4", "Alat3"],
    };

    const result = convertCategorizedPricesIntoRows(input);

    expect(result.map((row) => row.name)).toEqual([
      "Alat2",
      "Alat1",
      "Alat4",
      "Alat3",
    ]);
  });

  it("should handle alats with zero prices", () => {
    const input = {
      "Prices Present Alats": [
        { name: "Alat1", harga_bulanan: 0, harga_harian: 0 },
      ],
      "Prices Missing Alats": [],
    };

    const expected = [
      { name: "Alat1", hargaBulanan: 0, hargaHarian: 0, status: "present" },
    ];

    expect(convertCategorizedPricesIntoRows(input)).toEqual(expected);
  });
});
