import { GroupedRecord, ToReturn } from "../../generateTagihan";
import { fillEmpty } from "./fillEmpty/fillEmpty";
import { groupByTanggalAndJumlahSign } from "./groupByTanggalAndJumlahSign/groupByTanggalAndJumlahSign";

export function groupByTanggalAndSign(input: ToReturn): GroupedRecord {
  const firstResult: GroupedRecord = {};

  for (const [alatName, alatRecord] of Object.entries(input)) {
    const groupedByTanggalAndJumlahSign = groupByTanggalAndJumlahSign(
      alatRecord.records
    );

    firstResult[alatName] = groupedByTanggalAndJumlahSign;
  }

  const final = fillEmpty(firstResult);

  console.log(JSON.stringify(final, null, 2));

  return final;
}
