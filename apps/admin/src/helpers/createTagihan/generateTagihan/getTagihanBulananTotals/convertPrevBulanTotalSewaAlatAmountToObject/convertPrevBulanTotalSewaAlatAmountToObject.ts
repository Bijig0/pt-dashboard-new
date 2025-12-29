import { group } from "radash";
import * as A from "fp-ts/Array";
import { identity, pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import { AlatName } from "../../../../createRekapan/types";

export const convertPrevBulanTotalSewaAlatAmountToObject = <
  PrevBulanHeader extends { alatName: string; jumlahAlat: number }[],
>(
  prevBulanTotalSewaAlatAmount: PrevBulanHeader
): Record<AlatName, { prevBulanTotalSewaAlatAmount: number }> => {
  return pipe(
    group(prevBulanTotalSewaAlatAmount, ({ alatName }) => alatName),
    R.map(A.lookup(0)),
    R.sequence(O.Monad),
    O.match(() => {
      throw new Error("Weird error don't know ");
    }, identity),
    R.map((each) => {
      return {
        prevBulanTotalSewaAlatAmount: each.jumlahAlat,
      };
    })
  );
};
