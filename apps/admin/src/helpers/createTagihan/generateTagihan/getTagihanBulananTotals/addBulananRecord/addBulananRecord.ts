import { pipe } from "fp-ts/lib/function";
import * as R from "fp-ts/Record";
import { AlatName } from "../../../../createRekapan/types";

type Args = {
  bulananJumlah: Record<
    AlatName,
    {
      bulananJumlah: number;
    }
  >;
  tanggalStart: string;
  tanggalEnd: string;
  daysInMonth: number;
};

export const addBulananRecord = ({
  tanggalStart,
  tanggalEnd,
  daysInMonth,
  bulananJumlah,
}: Args) => {
  return pipe(
    bulananJumlah,
    R.map(({ bulananJumlah }) => {
      return {
        records: [
          {
            tanggalRange: {
              start: tanggalStart,
              end: tanggalEnd,
            },
            days: daysInMonth,
            jumlah: bulananJumlah,
          },
        ],
      };
    })
  );
};
