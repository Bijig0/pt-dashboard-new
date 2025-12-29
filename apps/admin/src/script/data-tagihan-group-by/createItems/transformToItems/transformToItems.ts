import { CleanedDataTagihanSchema, ItemsSchema } from "../schema/schema";

export const transformToItems = (
  rows: CleanedDataTagihanSchema
): ItemsSchema => {
  return rows.map(([itemName, itemPrice]) => ({
    itemName,
    itemPrice,
  }));
};
