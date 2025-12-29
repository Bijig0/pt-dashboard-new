import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";
import { sum } from "radash";
import { parseDateDDMMYYYY } from "../../../../../utils/parseDateDDMMYYYY/parseDateDDMMYYYY";
import { AlatName } from "../../../../createRekapan/types";

/**
 * When getting the tagihan bulanan totals, we have the first date as part of the month's totals
 * so we need to get the first date amount, to later then add it to the totals
 */
export const getFirstDateAmountIfPresent = <
  Records extends Record<
    AlatName,
    { records: { tanggal: string; jumlah: number }[] }
  >,
>(
  records: Records
): Record<AlatName, { firstDateAmount: number }> => {
  return pipe(
    records,
    R.map(({ records }) => {
      return pipe(
        records,
        A.filter(({ tanggal, jumlah }) => {
          console.log({ tanggal });
          const isFirstDateOfMonth = parseDateDDMMYYYY(tanggal)
            .startOf("month")
            .isSame(parseDateDDMMYYYY(tanggal));
          const isPositiveJumlah = jumlah > 0;
          return isFirstDateOfMonth && isPositiveJumlah;
        }),
        (records) => {
          if (records.length === 0) return { firstDateAmount: 0 };
          const firstDateAmountsSummed = sum(records, ({ jumlah }) => jumlah);
          return { firstDateAmount: firstDateAmountsSummed };
        }
      );
    })
  );
};
