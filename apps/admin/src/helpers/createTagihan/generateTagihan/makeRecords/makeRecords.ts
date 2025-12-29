import { GroupedRecord, Input } from "../generateTagihan";
import { setRecordsNegativeJumlahsToPositive } from "../getTagihanRegularSewaTotals/setRecordsNegativeJumlahsToPositive/setRecordsNegativeJumlahsToPositive";
import { convertToSingleAlatRows } from "./convertToSingleAlatRows/convertToSingleAlatRows";
import { groupByTanggalAndSign } from "./groupByTanggalAndSign/groupByTanggalAndSign";
import { removeUndefinedJumlahs } from "./removeUndefinedJumlahs/removeUndefinedJumlahs";

export const makeRecords = (records: Input): GroupedRecord => {
  const alatAndTanggals = convertToSingleAlatRows(records);

  console.log({ alatAndTanggals });

  const withoutUndefinedJumlahs = removeUndefinedJumlahs(alatAndTanggals);

  console.log({ alatAndTanggals });

  const groupedInput = groupByTanggalAndSign(withoutUndefinedJumlahs);

  console.log({ groupedInput });

  const jumlahAllAsPositive = setRecordsNegativeJumlahsToPositive(groupedInput);

  return jumlahAllAsPositive;
};

// @ts-ignore
if (import.meta.main) {
  const mockInput: Input = [
    {
      tanggal: "20/07/2023",
      alatRecords: [
        {
          alatName: "Alat1",
          jumlahAlat: 5,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
        {
          alatName: "Alat2",
          jumlahAlat: -4,
          hargaBulanan: 80,
          hargaHarian: 2.67,
        },
      ],
    },
    {
      tanggal: "21/07/2023",
      alatRecords: [
        {
          alatName: "Alat1",
          jumlahAlat: -3,
          hargaBulanan: 50,
          hargaHarian: 1.67,
        },
        { alatName: "Alat2", jumlahAlat: 6, hargaBulanan: 60, hargaHarian: 2 },
      ],
    },
  ];

  const result = makeRecords(mockInput);

  console.log({ result });
}
