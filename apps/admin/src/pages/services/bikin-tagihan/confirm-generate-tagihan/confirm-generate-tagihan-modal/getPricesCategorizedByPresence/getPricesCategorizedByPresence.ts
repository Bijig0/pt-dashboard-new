import { AlatName } from "../../../../../../helpers/createRekapan/types";
import { HargaAlat } from "../../../../../../hooks/useGetAllHargaAlat";
import { categorizePricesByPresence } from "./categorizePricesByPresence/categorizePricesByPresence";
import {
  AlatDataRow,
  convertCategorizedPricesIntoRows,
} from "./convertCategorizedPricesIntoRows/convertCategorizedPricesIntoRows";

export type AlatsCategorizedByPresence = {
  currentWorksheetAlatNames: AlatName[];
  presentPrices: HargaAlat[];
};

export const getPricesCategorizedByPresence = ({
  currentWorksheetAlatNames,
  presentPrices,
}: AlatsCategorizedByPresence): AlatDataRow[] => {
  const alatsCategorizedByPresence = categorizePricesByPresence({
    currentWorksheetAlatNames,
    presentPrices,
  });

  const asRows = convertCategorizedPricesIntoRows(alatsCategorizedByPresence);

  const sortedByPresence = asRows.toSorted((a, b) => {
    if (a.status === "missing" && b.status === "present") {
      return -1; // a comes before b
    } else if (a.status === "present" && b.status === "missing") {
      return 1; // b comes before a
    } else {
      return 0; // keep the same order if both are "missing" or both are "present"
    }
  });

  return sortedByPresence;
};
