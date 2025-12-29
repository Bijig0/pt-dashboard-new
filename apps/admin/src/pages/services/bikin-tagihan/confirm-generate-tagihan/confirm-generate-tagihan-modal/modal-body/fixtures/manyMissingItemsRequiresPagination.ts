import { AlatDataRow } from "../../getPricesCategorizedByPresence/convertCategorizedPricesIntoRows/convertCategorizedPricesIntoRows";

export const manyMissingItemsRequiresPagination = [
  { name: "Alat 1", status: "missing" },
  { name: "Alat 2", status: "missing" },
  {
    name: "Alat 3",
    status: "missing",
  },
] satisfies AlatDataRow[] as AlatDataRow[];
