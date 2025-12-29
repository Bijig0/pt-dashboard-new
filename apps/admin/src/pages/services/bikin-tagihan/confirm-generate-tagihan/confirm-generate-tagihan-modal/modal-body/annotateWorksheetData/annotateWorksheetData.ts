import { cleanAGGridColumnName } from "../../../../../../../../src/helpers/cleanAGGridColumnName.js";
import { AlatRecord } from "../../../../../../../../src/helpers/createTagihan/generateTagihan/generateTagihan.js";
import { AgGridRow } from "../../../../../../../../src/pages/services/bikin-tagihan/types.js";
import { HargaAlatSchema } from "../../../../../../../../src/types/schemas.js";

type Input = {
  tanggal: string;
  alatRecords: AlatRecord[];
}[];

export const annotateWorksheetData = (
  worksheetData: AgGridRow[],
  hargaAlatData: HargaAlatSchema
): Input => {
  const result: Input = [];

  for (const row of worksheetData) {
    const tanggal = row["Tanggal"];

    const alatRecords: AlatRecord[] = [];

    const alatNames = Object.keys(row).filter((key) => key !== "Tanggal");

    for (const alatName of alatNames) {
      const jumlahAlat = row[alatName!];
      const alatRecord = {
        alatName: alatName!,
        jumlahAlat: jumlahAlat as number,
        hargaBulanan: hargaAlatData.find(
          (hargaAlat) => cleanAGGridColumnName(hargaAlat.name) === alatName!
        )?.harga_bulanan!,
        hargaHarian: hargaAlatData.find(
          (hargaAlat) => cleanAGGridColumnName(hargaAlat.name) === alatName!
        )?.harga_harian!,
      } satisfies AlatRecord;
      alatRecords.push(alatRecord);
    }

    const eachInput = {
      tanggal: tanggal as string,
      alatRecords: alatRecords,
    };

    result.push(eachInput);
  }

  return result;
};

// @ts-ignore
if (import.meta.main) {
  const mockWorksheetData: AgGridRow[] = [
    {
      Tanggal: "Sisa Alat",
      "CB 193": 270,
      "LD 90": 71,
      Catwalk: 1304,
      "CB 220": 3378,
      "MF 190": 920,
      "Join Pin": 6630,
      "UH 60": 1188,
      "JB 60": 1393,
      "MF 170": 1140,
      Tangga: 201,
      "Swivel C": 800,
    },
    {
      Tanggal: "12/06/2024",
      Catwalk: 150,
      "CB 220": 250,
      "MF 170": 250,
      Tangga: 50,
    },
    { Tanggal: "14/06/2024", Catwalk: 150, "CB 220": 250, "MF 170": 250 },
    {
      Tanggal: "Sisa Alat",
      "CB 193": 270,
      "LD 90": 71,
      Catwalk: 1604,
      "CB 220": 3878,
      "MF 190": 920,
      "Join Pin": 6630,
      "UH 60": 1188,
      "JB 60": 1393,
      "MF 170": 1640,
      Tangga: 251,
      "Swivel C": 800,
    },
  ] as unknown as AgGridRow[];

  const mockHargaAlatData: HargaAlatSchema = [
    { name: "CB 193", harga_bulanan: 4500, harga_harian: 150 },
    { name: "LD 90", harga_bulanan: 5500, harga_harian: 183.33 },
    { name: "Catwalk", harga_bulanan: 19400, harga_harian: 646.67 },
    { name: "CB 220", harga_bulanan: 4500, harga_harian: 150 },
    { name: "MF 190", harga_bulanan: 6250, harga_harian: 208.33 },
    { name: "Join Pin", harga_bulanan: 1500, harga_harian: 50 },
    { name: "UH 60", harga_bulanan: 4500, harga_harian: 150 },
    { name: "JB 60", harga_bulanan: 4500, harga_harian: 150 },
    { name: "MF 170", harga_bulanan: 6250, harga_harian: 208.33 },
    { name: "Tangga", harga_bulanan: 30000, harga_harian: 1000 },
    { name: "Swivel C", harga_bulanan: 2500, harga_harian: 83.33 },
  ];

  const result = annotateWorksheetData(mockWorksheetData, mockHargaAlatData);

  console.dir({ result }, { depth: null });
}
