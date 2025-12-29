import { beforeEach, describe, expect, test, vi } from "vitest";
import * as CheckBorrowPeriodForWholeMonthModule from "../../../convertTagihanJSToWorkbook/createLamaSewa/checkBorrowPeriodForWholeMonth/checkBorrowPeriodForWholeMonth";
import * as CalculateBulananTotalSubtotalModule from "./calculateBulananTotalSubtotal/calculateBulananTotalSubtotal";
import * as CalculateHarianTotalSubtotalModule from "./calculateHarianTotalSubtotal/calculateHarianTotalSubtotal";
import { calculateTotalSubtotal } from "./calculateTotalSubtotal";

describe("calculateTotalSubtotal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("should calculate bulanan total when borrow period is for the whole month", () => {
    const checkBorrowPeriodForWholeMonthSpy = vi
      .spyOn(
        CheckBorrowPeriodForWholeMonthModule,
        "checkBorrowPeriodForWholeMonth"
      )
      .mockReturnValue(true);
    const calculateBulananTotalSubtotalSpy = vi
      .spyOn(
        CalculateBulananTotalSubtotalModule,
        "calculateBulananTotalSubtotal"
      )
      .mockReturnValue(5000);

    const calculateHarianTotalSubtotalSpy = vi.spyOn(
      CalculateHarianTotalSubtotalModule,
      "calculateHarianTotalSubtotal"
    );

    const record = {
      days: 30,
      jumlah: 5,
      hargaHarian: 100,
      hargaBulanan: 1000,
      tanggalWithinMonth: "01/07/2023",
    };

    const result = calculateTotalSubtotal(record);

    expect(result).toBe(5000);
    expect(checkBorrowPeriodForWholeMonthSpy).toHaveBeenCalledWith(
      30,
      "01/07/2023"
    );
    expect(calculateBulananTotalSubtotalSpy).toHaveBeenCalledWith({
      jumlah: 5,
      hargaBulanan: 1000,
    });
    expect(calculateHarianTotalSubtotalSpy).not.toHaveBeenCalled();
  });

  test("should calculate harian total when borrow period is not for the whole month", () => {
    const checkBorrowPeriodForWholeMonthSpy = vi
      .spyOn(
        CheckBorrowPeriodForWholeMonthModule,
        "checkBorrowPeriodForWholeMonth"
      )
      .mockReturnValue(false);
    const calculateHarianTotalSubtotalSpy = vi
      .spyOn(CalculateHarianTotalSubtotalModule, "calculateHarianTotalSubtotal")
      .mockReturnValue(1500);

    const calculateBulananTotalSubtotalSpy = vi.spyOn(
      CalculateBulananTotalSubtotalModule,
      "calculateBulananTotalSubtotal"
    );

    const record = {
      days: 15,
      jumlah: 5,
      hargaHarian: 100,
      hargaBulanan: 1000,
      tanggalWithinMonth: "01/07/2023",
    };

    const result = calculateTotalSubtotal(record);

    expect(result).toBe(1500);
    expect(checkBorrowPeriodForWholeMonthSpy).toHaveBeenCalledWith(
      15,
      "01/07/2023"
    );
    expect(calculateHarianTotalSubtotalSpy).toHaveBeenCalledWith({
      days: 15,
      jumlah: 5,
      hargaHarian: 100,
    });
    expect(calculateBulananTotalSubtotalSpy).not.toHaveBeenCalled();
  });
});
