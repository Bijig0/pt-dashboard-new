import { ItemsSchema } from "./types";

export const sortItemsByName = (items: ItemsSchema): ItemsSchema => {
  return items.sort((a, b) =>
    a.itemName.localeCompare(b.itemName, undefined, { sensitivity: "base" })
  );
};
