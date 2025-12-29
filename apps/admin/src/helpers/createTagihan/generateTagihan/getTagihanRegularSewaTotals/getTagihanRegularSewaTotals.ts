import { pipe } from "fp-ts/lib/function";
import { formatAsTanggalRange } from "../formatAsTanggalRange/formatAsTanggalRange";
import { Input } from "../generateTagihan";
import { makeRecords } from "../makeRecords/makeRecords";
import { removeFirstDateRecords } from "./removeFirstDateRecords/removeFirstDateRecords";

export const getTagihanRegularSewaTotals = (records: Input) => {
  const tagihanRegularSewaTotals = pipe(
    records,
    removeFirstDateRecords,
    makeRecords,
    formatAsTanggalRange
  );

  return tagihanRegularSewaTotals;
};
// @ts-ignore
if (import.meta.main) {
  const input: Input = [
    {
      tanggal: "01/07/2023",
      alatRecords: [
        { alatName: "Alat1", jumlahAlat: 2, hargaBulanan: 60, hargaHarian: 2 },
      ],
    },
  ];

  const result = getTagihanRegularSewaTotals(input);

  console.dir(result, { depth: null });
}
