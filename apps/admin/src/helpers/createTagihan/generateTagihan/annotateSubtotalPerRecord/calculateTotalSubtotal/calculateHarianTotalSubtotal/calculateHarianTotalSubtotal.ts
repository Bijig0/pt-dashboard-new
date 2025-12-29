import currency from "currency.js";
import precondition from "../../../../../../utils/precondition";

type Args = {
  days: number;
  jumlah: number;
  hargaHarian: number;
};

export const calculateHarianTotalSubtotal = (record: Args): number => {
  const { days, jumlah, hargaHarian } = record;
  precondition(Number.isInteger(days), "Days must be an integer");
  precondition(Number.isInteger(jumlah), "Jumlah must be an integer");
  precondition(hargaHarian >= 0, "Must be positive hargaHarian");

  const harga = currency(hargaHarian);

  const harianHarga = harga.multiply(days).multiply(jumlah);

  return harianHarga.value;
};
