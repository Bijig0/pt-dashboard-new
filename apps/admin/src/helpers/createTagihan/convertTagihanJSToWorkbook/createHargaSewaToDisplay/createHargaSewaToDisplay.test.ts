import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { describe, expect, it, vi } from "vitest";
import * as checkModule from "../createLamaSewa/checkBorrowPeriodForWholeMonth/checkBorrowPeriodForWholeMonth";
import { Args, createHargaSewaToDisplay } from "./createHargaSewaToDisplay";

dayjs.extend(utc);

describe("createHargaSewaToDisplay", () => {
  it("should return hargaSewa when borrowed for a whole month", () => {
    vi.spyOn(checkModule, "checkBorrowPeriodForWholeMonth").mockReturnValue(
      true
    );
    const result = createHargaSewaToDisplay({
      hargaBulanan: 1000,
      hargaHarian: 30,
      record: {
        tanggalRange: { start: "01/07/2024", end: "31/07/2024" },
        days: 31,
      },
    } satisfies Args);
    expect(result).toBe(1000);
  });

  it("should return harian harga sewa when not borrowed for a whole month", () => {
    vi.spyOn(checkModule, "checkBorrowPeriodForWholeMonth").mockReturnValue(
      false
    );
    const result = createHargaSewaToDisplay({
      hargaBulanan: 1000,
      hargaHarian: 30,
      record: {
        tanggalRange: { start: "01/07/2024", end: "15/07/2024" },
        days: 15,
      },
    } satisfies Args);
    expect(result).toBe(30);
  });

  it("should call checkBorrowPeriodForWholeMonth with correct arguments", () => {
    vi.restoreAllMocks();
    const mockCheck = vi.spyOn(checkModule, "checkBorrowPeriodForWholeMonth");
    createHargaSewaToDisplay({
      hargaBulanan: 1000,
      hargaHarian: 30,
      record: {
        tanggalRange: { start: "01/07/2024", end: "31/07/2024" },
        days: 31,
      },
    } satisfies Args);
    expect(mockCheck).toHaveBeenCalledWith(31, "01/07/2024");
    expect(mockCheck).toReturnWith(true);
  });

  it("should display hargaBulanan February in a leap year correctly given a full month", () => {
    vi.spyOn(checkModule, "checkBorrowPeriodForWholeMonth").mockReturnValue(
      true
    );
    const result = createHargaSewaToDisplay({
      hargaBulanan: 1000,
      hargaHarian: 30,
      record: {
        tanggalRange: { start: "01/02/2024", end: "29/02/2024" },
        days: 29,
      },
    } satisfies Args);
    expect(result).toBe(1000);
  });

  it("should display hargaBulanan February in a non-leap year correctly given a full month", () => {
    vi.spyOn(checkModule, "checkBorrowPeriodForWholeMonth").mockReturnValue(
      true
    );
    const result = createHargaSewaToDisplay({
      hargaBulanan: 1000,
      hargaHarian: 30,
      record: {
        tanggalRange: { start: "01/02/2023", end: "28/02/2023" },
        days: 28,
      },
    } satisfies Args);
    expect(result).toBe(1000);
  });
});
