import { pipe } from "fp-ts/lib/function";
import * as R from "fp-ts/Record";
import { merge } from "ts-deepmerge";
import { AlatName } from "../../../../createRekapan/types";

type CalculateBulananArgs = {
  prevBulanObj: Record<AlatName, { prevBulanTotalSewaAlatAmount: number }>;
  firstDateAmountIfPresent: Record<AlatName, { firstDateAmount: number }>;
  sumOfAllNegatives: Record<AlatName, { negativesSum: number }>;
};

export const calculateBulananJumlahs = ({
  firstDateAmountIfPresent,
  sumOfAllNegatives,
  prevBulanObj,
}: CalculateBulananArgs): Record<AlatName, { bulananJumlah: number }> => {
  return pipe(
    merge(prevBulanObj, firstDateAmountIfPresent, sumOfAllNegatives),
    R.map(
      ({
        prevBulanTotalSewaAlatAmount = 0,
        firstDateAmount = 0,
        negativesSum = 0,
      }) => {
        return {
          bulananJumlah:
            (prevBulanTotalSewaAlatAmount || 0) +
            (firstDateAmount || 0) +
            (negativesSum || 0),
        };
      }
    )
  );
};
// @ts-ignore
if (import.meta.main) {
  const sumOfAllNegatives = {
    "Alat 1": {
      negativesSum: 0,
    },
  };

  const firstDateAmountIfPresent = {
    "Alat 1": {
      firstDateAmount: 0,
    },
  };

  const prevBulanObj = {
    "Alat 1": {
      prevBulanTotalSewaAlatAmount: 10,
    },
    "Alat 2": {
      prevBulanTotalSewaAlatAmount: 20,
    },
  };

  const result = calculateBulananJumlahs({
    sumOfAllNegatives,
    firstDateAmountIfPresent,
    prevBulanObj,
  });

  console.log({ result });
}
