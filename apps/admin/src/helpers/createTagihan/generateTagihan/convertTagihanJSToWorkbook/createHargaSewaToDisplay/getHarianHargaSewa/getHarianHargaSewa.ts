import currency from "currency.js";
import precondition from "../../../../../../utils/precondition";

export const getHarianHargaSewa = (
  hargaBulanan: number,
  daysInMonth: number
): number => {
  console.log({ hargaBulanan, daysInMonth });
  precondition(daysInMonth > 0, "Days in month must be greater than 0");

  const harga = currency(hargaBulanan);

  const harianHarga = harga.divide(daysInMonth);

  return harianHarga.value;
};

// @ts-ignore
if (import.meta.main) {
  const hargaBulanan = 100;
  const daysInMonth = 33;

  const result = getHarianHargaSewa(hargaBulanan, daysInMonth);

  console.log({ result });
}
