import currency from "currency.js";
import precondition from "../../../../../../utils/precondition";

type Args = {
  jumlah: number;
  hargaBulanan: number;
};

export const calculateBulananTotalSubtotal = (record: Args): number => {
  const { jumlah, hargaBulanan } = record;
  console.log({ jumlah });
  precondition(Number.isInteger(jumlah), "Jumlah must be an integer");
  precondition(jumlah >= 0, "Jumlah must be greater than or equal to0");
  precondition(hargaBulanan >= 0, "Must be positive hargaBulanan");
  const harga = currency(hargaBulanan);

  const harianHarga = harga.multiply(jumlah);

  return harianHarga.value;
};
