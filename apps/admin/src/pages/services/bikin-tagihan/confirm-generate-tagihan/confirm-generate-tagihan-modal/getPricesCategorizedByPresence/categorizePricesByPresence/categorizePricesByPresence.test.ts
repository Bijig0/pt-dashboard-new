import { CompanyName } from "../../../../../../../helpers/createRekapan/types";
import { HargaAlat } from "../../../../../../../hooks/useGetAllHargaAlat";
import { categorizePricesByPresence } from "./categorizePricesByPresence"; // Assuming the function is in a file named categorizePricesByPresence.ts

describe("categorizePricesByPresence", () => {
  const samplePresentPrices: HargaAlat[] = [
    { name: "Company A", harga_bulanan: 1000, harga_harian: 50 },
    { name: "Company B", harga_bulanan: 2000, harga_harian: 100 },
    { name: "Company C", harga_bulanan: 3000, harga_harian: 150 },
  ];

  it("should return all companies as present when all names match", () => {
    const currentWorksheetAlatNames: CompanyName[] = [
      "Company A",
      "Company B",
      "Company C",
    ];
    const result = categorizePricesByPresence({
      currentWorksheetAlatNames,
      presentPrices: samplePresentPrices,
    });

    expect(result["Prices Present Alats"]).toEqual(samplePresentPrices);
    expect(result["Prices Missing Alats"]).toEqual([]);
  });

  it("should return some companies as missing when not all names match", () => {
    const currentWorksheetAlatNames: CompanyName[] = [
      "Company A",
      "Company D",
      "Company C",
    ];

    const result = categorizePricesByPresence({
      currentWorksheetAlatNames,
      presentPrices: samplePresentPrices,
    });

    expect(result["Prices Present Alats"]).toEqual([
      { name: "Company A", harga_bulanan: 1000, harga_harian: 50 },
      { name: "Company C", harga_bulanan: 3000, harga_harian: 150 },
    ]);
    expect(result["Prices Missing Alats"]).toEqual(["Company D"]);
  });

  it("should return all companies as missing when no names match", () => {
    const currentWorksheetAlatNames: CompanyName[] = [
      "Company X",
      "Company Y",
      "Company Z",
    ];
    const result = categorizePricesByPresence({
      currentWorksheetAlatNames,
      presentPrices: samplePresentPrices,
    });

    expect(result["Prices Present Alats"]).toEqual([]);
    expect(result["Prices Missing Alats"]).toEqual([
      "Company X",
      "Company Y",
      "Company Z",
    ]);
  });

  it("should handle empty input arrays", () => {
    const result = categorizePricesByPresence({
      currentWorksheetAlatNames: [],
      presentPrices: [],
    });

    expect(result["Prices Present Alats"]).toEqual([]);
    expect(result["Prices Missing Alats"]).toEqual([]);
  });

  it("should handle case-sensitive company names", () => {
    const currentWorksheetAlatNames: CompanyName[] = [
      "company a",
      "COMPANY B",
      "Company C",
    ];
    const result = categorizePricesByPresence({
      currentWorksheetAlatNames,
      presentPrices: samplePresentPrices,
    });

    expect(result["Prices Present Alats"]).toEqual([
      { name: "Company C", harga_bulanan: 3000, harga_harian: 150 },
    ]);
    expect(result["Prices Missing Alats"]).toEqual(["company a", "COMPANY B"]);
  });
});
