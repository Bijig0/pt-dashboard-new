import currency from "currency.js";

export const calculatePPN = (_total: number) => {
  const total = currency(_total);

  const ppn = total.multiply(0.11);

  return ppn.value;
};
