import { checkBorrowPeriodForWholeMonth } from "../../../convertTagihanJSToWorkbook/createLamaSewa/checkBorrowPeriodForWholeMonth/checkBorrowPeriodForWholeMonth";
import { calculateBulananTotalSubtotal } from "./calculateBulananTotalSubtotal/calculateBulananTotalSubtotal";
import { calculateHarianTotalSubtotal } from "./calculateHarianTotalSubtotal/calculateHarianTotalSubtotal";

type Args = {
  days: number;
  jumlah: number;
  hargaHarian: number;
  hargaBulanan: number;
  tanggalWithinMonth: string;
};

export const calculateTotalSubtotal = (record: Args): number => {
  const { days, jumlah, hargaHarian, hargaBulanan, tanggalWithinMonth } =
    record;

  console.log({ record });
  const isBorrowPeriodForWholeMonth = checkBorrowPeriodForWholeMonth(
    days,
    tanggalWithinMonth
  );

  const totalSubtotal = isBorrowPeriodForWholeMonth
    ? calculateBulananTotalSubtotal({ jumlah, hargaBulanan })
    : calculateHarianTotalSubtotal({ days, jumlah, hargaHarian });

  return totalSubtotal;
};
