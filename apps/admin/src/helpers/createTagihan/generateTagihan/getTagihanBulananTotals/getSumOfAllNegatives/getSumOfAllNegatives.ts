import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";
import { sum } from "radash";
import { AlatName } from "../../../../createRekapan/types";

/**
 * Now for the negatives, I'm not too sure why, but this added to the month total creates the bulanan total
 * not too sure how, but it works
 */
export const getSumOfAllNegatives = <
  Records extends Record<AlatName, { records: { jumlah: number }[] }>,
>(
  records: Records
): Record<AlatName, { negativesSum: number }> => {
  return pipe(
    records,
    R.map(({ records }) => {
      return pipe(
        records,
        A.filter(({ jumlah }) => jumlah < 0),
        (records) => {
          const negativesSum = sum(records, ({ jumlah }) => jumlah);
          return { negativesSum };
        }
      );
    })
  );
};
