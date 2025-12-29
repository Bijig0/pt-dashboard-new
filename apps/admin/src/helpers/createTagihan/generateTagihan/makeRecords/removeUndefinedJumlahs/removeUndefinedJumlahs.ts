import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import * as R from "fp-ts/Record";
import { AlatName } from "../../../../createRekapan/types";

export type SingleAlat = {
  tanggal: string;
  jumlah: number;
  hargaBulanan: number;
  hargaHarian: number;
}[] & {};

export type SingleAlatRecords = {
  records: SingleAlat;
} & {};

export const removeUndefinedJumlahs = <
  Worksheet extends Record<AlatName, SingleAlatRecords>,
>(
  input: Worksheet
): Record<AlatName, SingleAlatRecords> => {
  return pipe(
    input,
    R.map(R.map(A.filter((record) => record.jumlah !== undefined)))
  );
};

