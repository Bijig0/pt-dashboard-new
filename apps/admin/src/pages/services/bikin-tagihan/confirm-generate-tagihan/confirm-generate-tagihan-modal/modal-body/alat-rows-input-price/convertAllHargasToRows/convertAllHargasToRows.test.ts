import { AlatData } from "../../modal-body";
import { convertAllHargasToRows } from "./convertAllHargasToRows";

describe("convertAllHargasToRows", () => {
  it("should convert an empty record to an empty array", () => {
    const input: Record<string, AlatData> = {};
    const result = convertAllHargasToRows(input);
    expect(result).toEqual([]);
  });

  it("should convert a record with one entry to an array with one item", () => {
    const input: Record<string, AlatData> = {
      alat1: { alatName: "Alat 1", hargaBulanan: 100, hargaHarian: 10 },
    };
    const result = convertAllHargasToRows(input);
    expect(result).toEqual([
      { alatName: "Alat 1", hargaBulanan: 100, hargaHarian: 10 },
    ]);
  });

  it("should convert a record with multiple entries to an array with multiple items", () => {
    const input: Record<string, AlatData> = {
      alat1: { alatName: "Alat 1", hargaBulanan: 100, hargaHarian: 10 },
      alat2: { alatName: "Alat 2", hargaBulanan: 200, hargaHarian: 20 },
      alat3: { alatName: "Alat 3", hargaBulanan: 300, hargaHarian: 30 },
    };
    const result = convertAllHargasToRows(input);
    expect(result).toEqual([
      { alatName: "Alat 1", hargaBulanan: 100, hargaHarian: 10 },
      { alatName: "Alat 2", hargaBulanan: 200, hargaHarian: 20 },
      { alatName: "Alat 3", hargaBulanan: 300, hargaHarian: 30 },
    ]);
  });

  it("should not modify the original input", () => {
    const input: Record<string, AlatData> = {
      alat1: { alatName: "Alat 1", hargaBulanan: 100, hargaHarian: 10 },
    };
    const originalInput = { ...input };
    convertAllHargasToRows(input);
    expect(input).toEqual(originalInput);
  });

  it("should handle records with non-string keys", () => {
    const input: Record<string, AlatData> = {
      "1": { alatName: "Alat 1", hargaBulanan: 100, hargaHarian: 10 },
      "2": { alatName: "Alat 2", hargaBulanan: 200, hargaHarian: 20 },
    };
    const result = convertAllHargasToRows(input);
    expect(result).toEqual([
      { alatName: "Alat 1", hargaBulanan: 100, hargaHarian: 10 },
      { alatName: "Alat 2", hargaBulanan: 200, hargaHarian: 20 },
    ]);
  });
});
