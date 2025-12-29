export const calculateTotal = (
  items: { itemName: string; itemPrice: number }[]
): number => {
  return items.reduce((total, item) => total + item.itemPrice, 0);
};
