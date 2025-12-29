import { calculateTotal } from "./calculateTotal";
import { ItemsSchema } from "./types";

type Args = {
  items: ItemsSchema;
};

type Return = {
  items: ItemsSchema;
  total: number;
};

export const groupItemsByName = ({ items }: Args): Return => {
  const grouped = items.reduce(
    (acc, { itemName, itemPrice }) => {
      const existingItem = acc.find((item) => item.itemName === itemName);

      if (existingItem) {
        existingItem.itemPrice += itemPrice;
      } else {
        acc.push({ itemName, itemPrice });
      }

      return acc;
    },
    [] as { itemName: string; itemPrice: number }[]
  );

  const total = calculateTotal(grouped);

  return {
    items: grouped,
    total,
  };
};
