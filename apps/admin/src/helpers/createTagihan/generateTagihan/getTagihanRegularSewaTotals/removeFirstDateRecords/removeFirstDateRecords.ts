import { parseDateDDMMYYYY } from "../../../../../utils/parseDateDDMMYYYY/parseDateDDMMYYYY";
import { Input } from "../../generateTagihan";

export const removeFirstDateRecords = (records: Input): Input => {
  const filteredRecords = records.filter((record) => {
    const tanggal = parseDateDDMMYYYY(record.tanggal);
    const isFirstDate = tanggal.date() === 1;
    const day = tanggal.date();
    console.log({ day });
    console.log({ isFirstDate });
    return !isFirstDate;
  });
  console.log({ filteredRecords });
  return filteredRecords;
};

// @ts-ignore
if (import.meta.main) {
  const input = [
    {
      tanggal: "01/07/2023",
      alatRecords: [{ alatName: "Alat1", jumlahAlat: 2, hargaBulanan: 60, hargaHarian: 2 }],
    },
    {
      tanggal: "02/07/2023",
      alatRecords: [{ alatName: "Alat1", jumlahAlat: 3, hargaBulanan: 60, hargaHarian: 2 }],
    },
    {
      tanggal: "03/07/2023",
      alatRecords: [{ alatName: "Alat1", jumlahAlat: 4, hargaBulanan: 60, hargaHarian: 2 }],
    },
  ] satisfies Input;

  const result = removeFirstDateRecords(input);

  console.dir(result, { depth: null });
}
