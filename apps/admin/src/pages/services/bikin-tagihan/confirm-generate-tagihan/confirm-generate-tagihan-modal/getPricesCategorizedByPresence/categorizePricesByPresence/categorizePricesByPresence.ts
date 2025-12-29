import { AlatName } from "../../../../../../../helpers/createRekapan/types";
import { HargaAlat } from "../../../../../../../hooks/useGetAllHargaAlat";

type Args = {
  currentWorksheetAlatNames: AlatName[];
  presentPrices: HargaAlat[];
};

export type CategorizedPrices = {
  "Prices Present Alats": HargaAlat[];
  "Prices Missing Alats": AlatName[];
};

export const categorizePricesByPresence = (args: Args): CategorizedPrices => {
  const { currentWorksheetAlatNames, presentPrices } = args;

  // Step 1: Get all present alats
  const getPresentAlats = (companies: AlatName[]): HargaAlat[] =>
    companies
      .map((company) => presentPrices.find((price) => price.name === company))
      .filter((price): price is HargaAlat => price !== undefined);

  // Step 2: Get all missing alats
  const getMissingAlats = (companies: AlatName[]): AlatName[] =>
    companies.filter(
      (company) => !presentPrices.some((price) => price.name === company)
    );

  // Step 3: Compose the final result
  const composeResult = (
    presentAlats: HargaAlat[],
    missingAlats: AlatName[]
  ): CategorizedPrices => ({
    "Prices Present Alats": presentAlats,
    "Prices Missing Alats": missingAlats,
  });

  // Apply the transformations
  const presentAlats = getPresentAlats(currentWorksheetAlatNames);
  const missingAlats = getMissingAlats(currentWorksheetAlatNames);
  return composeResult(presentAlats, missingAlats);
};
