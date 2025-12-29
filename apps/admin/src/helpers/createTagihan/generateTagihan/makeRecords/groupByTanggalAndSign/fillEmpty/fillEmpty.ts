import { objectEntries } from "ts-extras";
import { z } from "zod";
import precondition from "../../../../../../utils/precondition";
import { splitOnLastDash } from "../../../../../../utils/splitOnLastDash/splitOnLastDash";
import { GroupedRecord } from "../../../generateTagihan";
import { isValidGroupedRecord } from "./isValidGroupedRecord/isValidGroupedRecord";

type AfterGroupBy = {
  [key: `${string}-${"Sewa" | "Retur"}`]: {
    tanggal: string;
    jumlah: number;
    hargaBulanan: number;
    hargaHarian: number;
  }[];
};

const inverseRentType = {
  Sewa: "Retur",
  Retur: "Sewa",
};

// TODO: Rewrite using fp-ts just pipe in objectEntries and objectFromEntries and shld be good enough
export const fillEmpty = (input: GroupedRecord): GroupedRecord => {
  precondition(
    isValidGroupedRecord(input),
    "There must only be one Sewa OR Retur per date"
  );
  const result: GroupedRecord = {};

  for (const [alatName, afterGroupBy] of Object.entries(input)) {
    const filledAfterGroupBys: AfterGroupBy = {};

    for (const [key, record] of objectEntries(afterGroupBy)) {
      // @ts-ignore
      // TODO: Fix this type
      filledAfterGroupBys[key]! = record;
      const [tanggal, rentType] = splitOnLastDash(key);
      const parsedRentType = z
        .union([z.literal("Sewa"), z.literal("Retur")])
        .parse(rentType);
      const inverseKey =
        `${tanggal}-${inverseRentType[parsedRentType]}` as const;
      if (inverseKey in input) continue;
      //   @ts-ignore
      filledAfterGroupBys[inverseKey] = undefined;
    }

    result[alatName] = filledAfterGroupBys;
  }

  return result;
};

// @ts-ignore
if (import.meta.main) {
  const input: GroupedRecord = {
    Alat1: {
      "01/07/2023-Sewa": [{ tanggal: "01/07/2023", jumlah: 2, hargaBulanan: 100, hargaHarian: 3.33 }],
      "01/07/2023-Retur": [{ tanggal: "01/07/2023", jumlah: -1, hargaBulanan: 100, hargaHarian: 3.33 }],
    },
  };

  const result = fillEmpty(input);

  console.dir(result, { depth: null });
}
