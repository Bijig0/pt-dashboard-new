export const formatItemPrice = (itemPrice: number) => {
  // Check if the number is a whole number
  if (Number.isInteger(itemPrice)) {
    return itemPrice.toLocaleString("en-US");
  }

  // If it has decimals, format with 2 decimal places
  return itemPrice.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
