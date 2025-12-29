import { AlatName } from "../../../../../createRekapan/types";
import { convertAlatRecordsToHargaObject } from "./convertAlatRecordsToHargaObject";

describe("convertAlatRecordsToHargaObject", () => {
  test("should convert alat records to harga object", () => {
    const alatRecords = [
      { alatName: "Alat1", hargaBulanan: 1000, hargaHarian: 100 },
      { alatName: "Alat2", hargaBulanan: 2000, hargaHarian: 200 },
    ];

    const expectedResult: Record<
      AlatName,
      { hargaBulanan: number; hargaHarian: number }
    > = {
      Alat1: { hargaBulanan: 1000, hargaHarian: 100 },
      Alat2: { hargaBulanan: 2000, hargaHarian: 200 },
    };

    const result = convertAlatRecordsToHargaObject(alatRecords);

    expect(result).toEqual(expectedResult);
  });

  test("should handle empty input array", () => {
    const alatRecords: {
      alatName: string;
      hargaBulanan: number;
      hargaHarian: number;
    }[] = [];

    const expectedResult: Record<
      AlatName,
      { hargaBulanan: number; hargaHarian: number }
    > = {};

    const result = convertAlatRecordsToHargaObject(alatRecords);

    expect(result).toEqual(expectedResult);
  });

  test("should handle records with same alatName", () => {
    const alatRecords = [
      { alatName: "Alat1", hargaBulanan: 1000, hargaHarian: 100 },
      { alatName: "Alat1", hargaBulanan: 1500, hargaHarian: 150 },
    ];

    const expectedResult: Record<
      AlatName,
      { hargaBulanan: number; hargaHarian: number }
    > = {
      Alat1: { hargaBulanan: 1500, hargaHarian: 150 },
    };

    const result = convertAlatRecordsToHargaObject(alatRecords);

    expect(result).toEqual(expectedResult);
  });
});
