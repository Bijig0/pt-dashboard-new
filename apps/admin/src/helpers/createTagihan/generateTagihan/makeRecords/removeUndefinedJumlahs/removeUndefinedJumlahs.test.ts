import { AlatName } from "../../../../createRekapan/types";
import {
  removeUndefinedJumlahs,
  SingleAlatRecords,
} from "./removeUndefinedJumlahs";

describe("removeUndefinedJumlahs", () => {
  it("should remove records with undefined jumlah", () => {
    const input = {
      Alat1: {
        records: [
          {
            tanggal: "01/07/2023",
            jumlah: 2,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
          {
            tanggal: "02/07/2023",
            jumlah: undefined as any,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
          {
            tanggal: "03/07/2023",
            jumlah: 3,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
        ],
      },
      Alat2: {
        records: [
          {
            tanggal: "01/07/2023",
            jumlah: 1,
            hargaBulanan: 200,
            hargaHarian: 6.67,
          },
          {
            tanggal: "02/07/2023",
            jumlah: undefined as any,
            hargaBulanan: 200,
            hargaHarian: 6.67,
          },
        ],
      },
    };

    const expected = {
      Alat1: {
        records: [
          {
            tanggal: "01/07/2023",
            jumlah: 2,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
          {
            tanggal: "03/07/2023",
            jumlah: 3,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
        ],
      },
      Alat2: {
        records: [
          {
            tanggal: "01/07/2023",
            jumlah: 1,
            hargaBulanan: 200,
            hargaHarian: 6.67,
          },
        ],
      },
    } satisfies Record<AlatName, SingleAlatRecords>;

    const result = removeUndefinedJumlahs(input);
    expect(result).toEqual(expected);
  });

  it("should handle empty records", () => {
    const input = {
      Alat1: {
        records: [],
      },
      Alat2: {
        records: [
          {
            tanggal: "01/07/2023",
            jumlah: 1,
            hargaBulanan: 200,
            hargaHarian: 6.67,
          },
        ],
      },
    };

    const expected = {
      Alat1: {
        records: [],
      },
      Alat2: {
        records: [
          {
            tanggal: "01/07/2023",
            jumlah: 1,
            hargaBulanan: 200,
            hargaHarian: 6.67,
          },
        ],
      },
    };

    const result = removeUndefinedJumlahs(input);
    expect(result).toEqual(expected);
  });

  it("should handle input with no undefined jumlahs", () => {
    const input = {
      Alat1: {
        records: [
          {
            tanggal: "01/07/2023",
            jumlah: 2,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
          {
            tanggal: "02/07/2023",
            jumlah: 3,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
        ],
      },
      Alat2: {
        records: [
          {
            tanggal: "01/07/2023",
            jumlah: 1,
            hargaBulanan: 200,
            hargaHarian: 6.67,
          },
        ],
      },
    };

    const result = removeUndefinedJumlahs(input);
    expect(result).toEqual(input);
  });

  it("should handle empty input", () => {
    const input = {};
    const result = removeUndefinedJumlahs(input);
    expect(result).toEqual({});
  });

  it("should handle input where all jumlahs are undefined", () => {
    const input = {
      Alat1: {
        records: [
          {
            tanggal: "01/07/2023",
            jumlah: undefined as any,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
          {
            tanggal: "02/07/2023",
            jumlah: undefined as any,
            hargaBulanan: 100,
            hargaHarian: 3.33,
          },
        ],
      },
    };

    const expected = {
      Alat1: {
        records: [],
      },
    };

    const result = removeUndefinedJumlahs(input);
    expect(result).toEqual(expected);
  });
});
