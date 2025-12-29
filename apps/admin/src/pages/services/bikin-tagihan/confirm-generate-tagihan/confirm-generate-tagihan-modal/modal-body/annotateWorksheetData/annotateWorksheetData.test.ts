import { fromAny } from "@total-typescript/shoehorn";
import { HargaAlatSchema } from "../../../../../../../../src/types/schemas.js";
import { annotateWorksheetData } from "./annotateWorksheetData.js";

describe("annotateWorksheetData", () => {
  const mockHargaAlatData: HargaAlatSchema = [
    { name: "Catwalk", harga_bulanan: 19400, harga_harian: 646.67 },
    { name: "CB 220", harga_bulanan: 4500, harga_harian: 150 },
  ];

  it("should correctly annotate worksheet data", () => {
    const result = annotateWorksheetData(
      fromAny([
        {
          Tanggal: "12/06/2024",
          Catwalk: 150,
          "CB 220": 250,
        },
        {
          Tanggal: "14/06/2024",
          Catwalk: 100,
          "CB 220": 200,
        },
      ]),
      mockHargaAlatData
    );

    expect(result).toEqual([
      {
        tanggal: "12/06/2024",
        alatRecords: [
          {
            alatName: "Catwalk",
            jumlahAlat: 150,
            hargaBulanan: 19400,
            hargaHarian: 646.67,
          },
          {
            alatName: "CB 220",
            jumlahAlat: 250,
            hargaBulanan: 4500,
            hargaHarian: 150,
          },
        ],
      },
      {
        tanggal: "14/06/2024",
        alatRecords: [
          {
            alatName: "Catwalk",
            jumlahAlat: 100,
            hargaBulanan: 19400,
            hargaHarian: 646.67,
          },
          {
            alatName: "CB 220",
            jumlahAlat: 200,
            hargaBulanan: 4500,
            hargaHarian: 150,
          },
        ],
      },
    ]);
  });

  it("should handle empty worksheet data", () => {
    const result = annotateWorksheetData([], mockHargaAlatData);
    expect(result).toEqual([]);
  });

  it("should handle worksheet data with no alat", () => {
    const result = annotateWorksheetData(
      fromAny([{ Tanggal: "12/06/2024" }, { Tanggal: "14/06/2024" }]),
      mockHargaAlatData
    );
    expect(result).toEqual([
      { tanggal: "12/06/2024", alatRecords: [] },
      { tanggal: "14/06/2024", alatRecords: [] },
    ]);
  });

  it("should handle missing harga alat data", () => {
    const result = annotateWorksheetData(
      fromAny([
        {
          Tanggal: "12/06/2024",
          Catwalk: 150,
          "Unknown Alat": 100,
        },
      ]),
      mockHargaAlatData
    );
    expect(result).toEqual([
      {
        tanggal: "12/06/2024",
        alatRecords: [
          {
            alatName: "Catwalk",
            jumlahAlat: 150,
            hargaBulanan: 19400,
            hargaHarian: 646.67,
          },
          {
            alatName: "Unknown Alat",
            jumlahAlat: 100,
            hargaBulanan: undefined,
            hargaHarian: undefined,
          },
        ],
      },
    ]);
  });
});
