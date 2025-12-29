import { ItemsSchema } from "../createItems/schema/schema";
import { formatItemPrice } from "./formatItemPrice/formatItemPrice";

export type FormattedItems = {
  itemName: string;
  itemPrice: string;
}[];

export const formatItemPrices = (items: ItemsSchema): FormattedItems => {
  const formattedItems = items.map(({ itemName, itemPrice }) => ({
    itemName,
    itemPrice: formatItemPrice(itemPrice),
  }));

  return formattedItems;
};
