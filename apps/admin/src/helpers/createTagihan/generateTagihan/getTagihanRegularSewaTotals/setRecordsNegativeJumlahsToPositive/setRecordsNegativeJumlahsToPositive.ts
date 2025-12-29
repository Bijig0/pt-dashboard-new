import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import * as R from "fp-ts/Record";
import { isDefined } from "ts-extras";
import { assert } from "tsafe";
import { GroupedRecord } from "../../generateTagihan";

export const setRecordsNegativeJumlahsToPositive = (
  records: GroupedRecord
): GroupedRecord => {
  assert(pipe(records, R.every(isDefined)), "Alats must all have records");
  return pipe(
    records,
    R.map(
      R.map((record) => {
        if (record === undefined) return undefined;
        return pipe(
          record,
          A.map((record) => ({
            ...record,
            jumlah: Math.abs(record.jumlah),
          }))
        );
      })
    )
  );
};

// @ts-ignore
if (import.meta.main) {
  //   const records: GroupedRecord = {
  //     Alat1: undefined,
  //   };
  //   const result = setRecordsNegativeJumlahsToPositive(records);
  //   console.log({ result });
}
