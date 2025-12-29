// Looks just like a group by honestly

import { Input, ToReturn } from "../../generateTagihan";

// TODO: Refactor this to use a group by function instead of a for loop
export const convertToSingleAlatRows = (input: Input): ToReturn => {
  const toReturn: ToReturn = {};

  console.log({ input });

  for (const row of input) {
    for (const alatRecord of row.alatRecords) {
      const alatName = alatRecord.alatName;
      if (!(alatName in toReturn)) {
        toReturn[alatName] = { records: [] };
      }
      const singleAlat = {
        tanggal: row.tanggal,
        jumlah: alatRecord.jumlahAlat,
        hargaBulanan: alatRecord.hargaBulanan,
        hargaHarian: alatRecord.hargaHarian,
      };
      toReturn[alatName]!.records.push(singleAlat);
    }
  }

  console.log({ toReturn });

  return toReturn;
};
