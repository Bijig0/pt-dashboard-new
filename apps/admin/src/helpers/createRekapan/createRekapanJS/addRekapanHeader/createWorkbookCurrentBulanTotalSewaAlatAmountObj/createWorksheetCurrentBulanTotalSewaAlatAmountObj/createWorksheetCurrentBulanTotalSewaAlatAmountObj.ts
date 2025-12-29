import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";
import { group, sum } from "radash";
import { merge } from "ts-deepmerge";
import { AlatName } from "../../../../types";

export type WorksheetAlatHeaderObj<Obj extends Record<PropertyKey, any>> =
  Record<AlatName, Obj> & {};

export const createWorksheetCurrentBulanTotalSewaAlatAmountObj = <
  MyWorksheet extends {
    records: { stokDifference: number | null; alatName: AlatName }[];
  },
>(
  worksheet: MyWorksheet,
  currentMonthWorksheetsPrevBulanTotalSewaAlatAmountObj: WorksheetAlatHeaderObj<{
    prevBulanTotalSewaAlatAmount: number;
  }>
): WorksheetAlatHeaderObj<{ currentBulanTotalSewaAlatAmount: number }> => {
  const records = worksheet.records;
  const recordsGroupedByAlatNames = pipe(
    group(records, ({ alatName }) => alatName),
    R.map((records) => {
      return { records };
    })
  );

  const merged = merge(
    recordsGroupedByAlatNames,
    currentMonthWorksheetsPrevBulanTotalSewaAlatAmountObj
  );

  console.log(JSON.stringify(merged, null, 2));

  const totalAmount = pipe(
    merged,
    R.map(({ records, prevBulanTotalSewaAlatAmount }) => {
      const calculateWorksheetCurrentBulanTotalSewaAlatAmount = (): number => {
        const currentBulanTotalSewaAlatAmountWithoutPrevMonths = sum(
          records!,
          (record) => {
            if (record.stokDifference === null)
              throw new Error("stokDifference is null");
            return record.stokDifference;
          }
        );

        const prevBulanTotalSewaAlatAmountToAdd =
          prevBulanTotalSewaAlatAmount ?? 0;

        const worksheetCurrentBulanTotalSewaAlatAmount =
          currentBulanTotalSewaAlatAmountWithoutPrevMonths +
          prevBulanTotalSewaAlatAmountToAdd;

        return worksheetCurrentBulanTotalSewaAlatAmount;
      };

      const currentBulanTotalSewaAlatAmount =
        calculateWorksheetCurrentBulanTotalSewaAlatAmount();
      return { currentBulanTotalSewaAlatAmount };
    })
  );

  console.log({ totalAmount });

  return totalAmount;
};

// @ts-ignore
if (import.meta.main) {
  const worksheet = {
    records: [
      { stokDifference: 5, alatName: "Alat1" },
      { stokDifference: 3, alatName: "Alat2" },
    ],
  };

  const prevBulanObj = {
    Alat1: { prevBulanTotalSewaAlatAmount: 10 },
  };

  const result = createWorksheetCurrentBulanTotalSewaAlatAmountObj(
    worksheet,
    prevBulanObj
  );

  console.log({ result });
}
