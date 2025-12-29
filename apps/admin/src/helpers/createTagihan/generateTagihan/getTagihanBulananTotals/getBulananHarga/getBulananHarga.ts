import { convertAlatRecordsToHargaObject } from "./convertAlatRecordsToHargaObject/convertAlatRecordsToHargaObject";

export const getBulananHarga = (
  alatRecords: {
    alatName: string;
    hargaBulanan: number;
    hargaHarian: number;
  }[]
) => {
  const bulananHarga = convertAlatRecordsToHargaObject(alatRecords);

  return bulananHarga;
};
