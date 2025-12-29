import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";
import { sum } from "radash";
import { AlatName } from "../../../createRekapan/types";
import { calculateTotalSubtotal } from "./calculateTotalSubtotal/calculateTotalSubtotal";

export type TagihanAlatRecord = {
  days: number;
  jumlah: number;
  tanggalRange: {
    start: string;
    end: string;
  };
};

export type ToReturnSingleRecord = TagihanAlatRecord & {
  totalSubtotal: number;
};

export const annotateSubtotalPerRecord = <
  RecordDetails extends {
    records: TagihanAlatRecord[];
    hargaBulanan: number;
    hargaHarian: number;
  },
>(
  input: Record<AlatName, RecordDetails>
): Record<
  AlatName,
  {
    records: ToReturnSingleRecord[];
    hargaBulanan: number;
    hargaHarian: number;
    recordsSubtotal: number;
  }
> => {
  return pipe(
    input,
    R.map((each) => {
      const records = pipe(
        each.records,
        A.map((record) => {
          return {
            ...record,
            totalSubtotal: calculateTotalSubtotal({
              days: record.days,
              jumlah: record.jumlah,
              tanggalWithinMonth: record.tanggalRange.start,
              hargaHarian: each.hargaHarian,
              hargaBulanan: each.hargaBulanan,
            }),
          };
        })
      );

      return {
        ...each,
        records,
        recordsSubtotal: sum(records, (record) => record.totalSubtotal),
      };
    })
  );
};

export default annotateSubtotalPerRecord;
