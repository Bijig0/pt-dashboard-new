import { beforeEach, describe, expect, it, vi } from "vitest";
import { AlatName } from "../../../createRekapan/types";
import {
  TagihanAlatRecord,
  annotateSubtotalPerRecord,
} from "./annotateSubtotalPerRecord";
import { calculateTotalSubtotal } from "./calculateTotalSubtotal/calculateTotalSubtotal";

vi.mock("./calculateTotalSubtotal/calculateTotalSubtotal");

describe("annotateSubtotalPerRecord", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should correctly annotate subtotals for a single record", () => {
    vi.mocked(calculateTotalSubtotal).mockReturnValue(1000);

    const input: Record<
      AlatName,
      {
        records: TagihanAlatRecord[];
        hargaBulanan: number;
        hargaHarian: number;
      }
    > = {
      Alat1: {
        records: [
          {
            days: 5,
            jumlah: 2,
            tanggalRange: { start: "01/01/2023", end: "05/01/2023" },
          },
        ],
        hargaBulanan: 100,
        hargaHarian: 0.33,
      },
    };

    const result = annotateSubtotalPerRecord(input);

    expect(result).toEqual({
      Alat1: {
        records: [
          {
            days: 5,
            jumlah: 2,
            tanggalRange: { start: "01/01/2023", end: "05/01/2023" },
            totalSubtotal: 1000,
          },
        ],
        hargaBulanan: 100,
        hargaHarian: 0.33,
        recordsSubtotal: 1000,
      },
    });

    expect(calculateTotalSubtotal).toHaveBeenCalledWith({
      days: 5,
      jumlah: 2,
      hargaHarian: 0.33,
      hargaBulanan: 100,
      tanggalWithinMonth: "01/01/2023",
    });
  });

  it("should correctly annotate subtotals for multiple records", () => {
    vi.mocked(calculateTotalSubtotal)
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(2000);

    const input: Record<
      AlatName,
      {
        records: TagihanAlatRecord[];
        hargaBulanan: number;
        hargaHarian: number;
      }
    > = {
      Alat1: {
        records: [
          {
            days: 5,
            jumlah: 2,
            tanggalRange: { start: "01/01/2023", end: "05/01/2023" },
          },
          {
            days: 3,
            jumlah: 4,
            tanggalRange: { start: "06/01/2023", end: "08/01/2023" },
          },
        ],
        hargaBulanan: 100,
        hargaHarian: 0.33,
      },
    };

    const result = annotateSubtotalPerRecord(input);

    expect(result).toEqual({
      Alat1: {
        records: [
          {
            days: 5,
            jumlah: 2,
            tanggalRange: { start: "01/01/2023", end: "05/01/2023" },
            totalSubtotal: 1000,
          },
          {
            days: 3,
            jumlah: 4,
            tanggalRange: { start: "06/01/2023", end: "08/01/2023" },
            totalSubtotal: 2000,
          },
        ],
        hargaBulanan: 100,
        hargaHarian: 0.33,
        recordsSubtotal: 3000,
      },
    });

    expect(calculateTotalSubtotal).toHaveBeenCalledTimes(2);
  });

  it("should handle multiple alat names", () => {
    vi.mocked(calculateTotalSubtotal)
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(2000);

    const input: Record<
      AlatName,
      {
        records: TagihanAlatRecord[];
        hargaBulanan: number;
        hargaHarian: number;
      }
    > = {
      Alat1: {
        records: [
          {
            days: 5,
            jumlah: 2,
            tanggalRange: { start: "01/01/2023", end: "05/01/2023" },
          },
        ],
        hargaBulanan: 100,
        hargaHarian: 0.33,
      },
      Alat2: {
        records: [
          {
            days: 3,
            jumlah: 4,
            tanggalRange: { start: "06/01/2023", end: "08/01/2023" },
          },
        ],
        hargaBulanan: 200,
        hargaHarian: 0.67,
      },
    };

    const result = annotateSubtotalPerRecord(input);

    expect(result).toEqual({
      Alat1: {
        records: [
          {
            days: 5,
            jumlah: 2,
            tanggalRange: { start: "01/01/2023", end: "05/01/2023" },
            totalSubtotal: 1000,
          },
        ],
        hargaBulanan: 100,
        hargaHarian: 0.33,
        recordsSubtotal: 1000,
      },
      Alat2: {
        records: [
          {
            days: 3,
            jumlah: 4,
            tanggalRange: { start: "06/01/2023", end: "08/01/2023" },
            totalSubtotal: 2000,
          },
        ],
        hargaBulanan: 200,
        hargaHarian: 0.67,
        recordsSubtotal: 2000,
      },
    });

    expect(calculateTotalSubtotal).toHaveBeenCalledTimes(2);
  });

  it("should handle empty records", () => {
    const input: Record<
      AlatName,
      {
        records: TagihanAlatRecord[];
        hargaBulanan: number;
        hargaHarian: number;
      }
    > = {
      Alat1: {
        records: [],
        hargaBulanan: 100,
        hargaHarian: 0.33,
      },
    };

    const result = annotateSubtotalPerRecord(input);

    expect(result).toEqual({
      Alat1: {
        records: [],
        hargaBulanan: 100,
        hargaHarian: 0.33,
        recordsSubtotal: 0,
      },
    });

    expect(calculateTotalSubtotal).not.toHaveBeenCalled();
  });
});
