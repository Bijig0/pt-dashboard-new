import { CleanedDataTagihanSchema, ItemsSchema } from "./types";

export const transformToItems = (
  rows: CleanedDataTagihanSchema
): ItemsSchema => {
  return rows.map(([itemName, itemPrice]) => ({
    itemName,
    itemPrice,
  }));
};
