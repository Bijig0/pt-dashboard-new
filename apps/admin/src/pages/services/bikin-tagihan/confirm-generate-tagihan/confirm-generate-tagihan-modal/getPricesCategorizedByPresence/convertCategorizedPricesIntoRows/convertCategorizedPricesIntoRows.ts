import { CategorizedPrices } from "../categorizePricesByPresence/categorizePricesByPresence";

export type AlatDataRow =
  | {
      name: string;
      hargaBulanan: number;
      hargaHarian: number;
      status: "present";
    }
  | {
      name: string;
      status: "missing";
    };

export const convertCategorizedPricesIntoRows = (
  categorizedPrices: CategorizedPrices
): AlatDataRow[] => {
  const presentRows = categorizedPrices["Prices Present Alats"].map((alat) => ({
    name: alat.name,
    hargaBulanan: alat.harga_bulanan,
    hargaHarian: alat.harga_harian,
    status: "present" as const,
  })) satisfies AlatDataRow[];

  const missingRows = categorizedPrices["Prices Missing Alats"].map((name) => ({
    name,
    status: "missing" as const,
  }));

  return [...presentRows, ...missingRows];
};
