import { sum } from "radash";
import { AlatName } from "../../../createRekapan/types";
import { calculatePPN } from "./calculatePPN/calculatePPN";
import currency from "currency.js";

export const calculateTagihanTotals = <
  Records extends Record<AlatName, { recordsSubtotal: number }>,
>(
  records: Records
): {
  data: Records;
  total: number;
  ppn: number;
  totalAfterPPN: number;
} => {
  const tagihanTotal = sum(
    Object.values(records),
    ({ recordsSubtotal }) => recordsSubtotal
  );

  const ppn = calculatePPN(tagihanTotal);

  return {
    data: records,
    total: tagihanTotal,
    ppn,
    totalAfterPPN: currency(tagihanTotal - ppn, { precision: 2 }).value,
  };
};
