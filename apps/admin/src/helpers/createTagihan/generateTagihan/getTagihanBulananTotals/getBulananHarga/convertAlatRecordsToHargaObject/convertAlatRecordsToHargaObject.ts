import { AlatName } from "../../../../../createRekapan/types";

export const convertAlatRecordsToHargaObject = (
  alatRecords: {
    alatName: string;
    hargaBulanan: number;
    hargaHarian: number;
  }[]
) => {
  const result: Record<
    AlatName,
    { hargaBulanan: number; hargaHarian: number }
  > = {};
  for (const record of alatRecords) {
    result[record.alatName] = {
      hargaBulanan: record.hargaBulanan,
      hargaHarian: record.hargaHarian,
    };
    console.log({ result });
  }
  return result;
};
