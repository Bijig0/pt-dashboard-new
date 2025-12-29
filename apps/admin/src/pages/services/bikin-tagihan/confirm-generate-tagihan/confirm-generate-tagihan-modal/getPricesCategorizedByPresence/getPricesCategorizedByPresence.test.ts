import { AlatName } from "../../../../../../helpers/createRekapan/types";
import { HargaAlat } from "../../../../../../hooks/useGetAllHargaAlat";
import { AlatDataRow } from "./convertCategorizedPricesIntoRows/convertCategorizedPricesIntoRows";
import { getPricesCategorizedByPresence } from "./getPricesCategorizedByPresence";

describe("getPricesCategorizedByPresence", () => {
  it("should categorize prices correctly when all alats are present", () => {
    const input = {
      currentWorksheetAlatNames: ["Alat1", "Alat2"] as AlatName[],
      presentPrices: [
        { name: "Alat1", harga_bulanan: 1000, harga_harian: 50 },
        { name: "Alat2", harga_bulanan: 2000, harga_harian: 100 },
      ] as HargaAlat[],
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
    ] satisfies AlatDataRow[];

    const result = getPricesCategorizedByPresence(input);
    expect(result).toEqual(expected);
  });

  it(`should categorize prices correctly when some alats are missing, 
        sorted by presnce missing first then present`, () => {
    const input = {
      currentWorksheetAlatNames: ["Alat1", "Alat2", "Alat3"] as AlatName[],
      presentPrices: [
        { name: "Alat1", harga_bulanan: 1000, harga_harian: 50 },
        { name: "Alat3", harga_bulanan: 3000, harga_harian: 150 },
      ] as HargaAlat[],
    };

    const expected = [
      {
        name: "Alat2",
        status: "missing",
      },
      {
        name: "Alat1",
        hargaBulanan: 1000,
        hargaHarian: 50,
        status: "present",
      },
      {
        name: "Alat3",
        hargaBulanan: 3000,
        hargaHarian: 150,
        status: "present",
      },
    ] satisfies AlatDataRow[];

    const result = getPricesCategorizedByPresence(input);
    expect(result).toEqual(expected);
  });

  it("should handle empty input correctly", () => {
    const input = {
      currentWorksheetAlatNames: [] as AlatName[],
      presentPrices: [] as HargaAlat[],
    };

    const expected: any[] = [];

    const result = getPricesCategorizedByPresence(input);
    expect(result).toEqual(expected);
  });

  it("should handle case when all alats are missing", () => {
    const input = {
      currentWorksheetAlatNames: ["Alat1", "Alat2"] as AlatName[],
      presentPrices: [] as HargaAlat[],
    };

    const expected = [
      {
        name: "Alat1",
        status: "missing",
      },
      {
        name: "Alat2",
        status: "missing",
      },
    ];

    const result = getPricesCategorizedByPresence(input);
    expect(result).toEqual(expected);
  });

  it("should handle case with duplicate alat names", () => {
    const input = {
      currentWorksheetAlatNames: ["Alat1", "Alat2", "Alat1"] as AlatName[],
      presentPrices: [
        { name: "Alat1", harga_bulanan: 1000, harga_harian: 50 },
        { name: "Alat2", harga_bulanan: 2000, harga_harian: 100 },
      ] as HargaAlat[],
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
      {
        name: "Alat1",
        hargaBulanan: 1000,
        hargaHarian: 50,
        status: "present",
      },
    ] satisfies AlatDataRow[];

    const result = getPricesCategorizedByPresence(input);
    expect(result).toEqual(expected);
  });
});
