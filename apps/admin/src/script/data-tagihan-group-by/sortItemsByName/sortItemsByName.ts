import { ItemsSchema } from "../createItems/schema/schema";

export const sortItemsByName = (items: ItemsSchema) => {
  return items.sort((a, b) =>
    a.itemName.localeCompare(b.itemName, undefined, { sensitivity: "base" })
  );
};
