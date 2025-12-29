import { AlatDataRow } from "../../getPricesCategorizedByPresence/convertCategorizedPricesIntoRows/convertCategorizedPricesIntoRows";

export const mixedItems = [
  {
    name: "Alat 1",
    hargaBulanan: 100,
    hargaHarian: 3.33,
    status: "present",
  },
  {
    name: "Alat 2",
    hargaBulanan: 200,
    hargaHarian: 6.67,
    status: "present",
  },
  {
    name: "Alat 3",
    status: "missing",
  },
] satisfies AlatDataRow[] as AlatDataRow[];
