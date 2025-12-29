import { beforeEach, describe, expect, it, vi } from "vitest";
import * as CheckBorrowPeriodForWholeMonthModule from "./checkBorrowPeriodForWholeMonth/checkBorrowPeriodForWholeMonth";
import { createLamaSewa } from "./createLamaSewa";

describe("createLamaSewa", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // Existing tests with mocks
  it('should return "1 BL" when borrowed for a whole month', () => {
    vi.spyOn(
      CheckBorrowPeriodForWholeMonthModule,
      "checkBorrowPeriodForWholeMonth"
    ).mockReturnValue(true);
    const result = createLamaSewa(31, "15/07/2024");
    expect(result).toBe("1 BL");
  });

  it('should return "X HR" when borrowed for less than a whole month', () => {
    vi.spyOn(
      CheckBorrowPeriodForWholeMonthModule,
      "checkBorrowPeriodForWholeMonth"
    ).mockReturnValue(false);
    const result = createLamaSewa(15, "15/07/2024");
    expect(result).toBe("15 HR");
  });

  it("should handle single-digit days correctly", () => {
    vi.spyOn(
      CheckBorrowPeriodForWholeMonthModule,
      "checkBorrowPeriodForWholeMonth"
    ).mockReturnValue(false);
    const result = createLamaSewa(5, "15/07/2024");
    expect(result).toBe("5 HR");
  });

  it("should handle zero days correctly", () => {
    vi.spyOn(
      CheckBorrowPeriodForWholeMonthModule,
      "checkBorrowPeriodForWholeMonth"
    ).mockReturnValue(false);
    const result = createLamaSewa(0, "15/07/2024");
    expect(result).toBe("0 HR");
  });

  it("should handle large number of days correctly", () => {
    vi.spyOn(
      CheckBorrowPeriodForWholeMonthModule,
      "checkBorrowPeriodForWholeMonth"
    ).mockImplementation(() => {
      throw new Error("Days borrowed is greater than days in month");
    });
    expect(() => createLamaSewa(100, "15/07/2024")).toThrow(
      "Days borrowed is greater than days in month"
    );
  });

  it("should call checkBorrowPeriodForWholeMonth with correct arguments", () => {
    const mockCheck = vi.spyOn(
      CheckBorrowPeriodForWholeMonthModule,
      "checkBorrowPeriodForWholeMonth"
    );
    createLamaSewa(31, "15/07/2024");
    expect(mockCheck).toHaveBeenCalledWith(31, "15/07/2024");
  });

  // New tests without mocks
  describe("Tests without mocks", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('should return "1 BL" for a 31-day month', () => {
      const result = createLamaSewa(31, "01/07/2024");
      expect(result).toBe("1 BL");
    });

    it('should return "1 BL" for a 30-day month', () => {
      const result = createLamaSewa(30, "01/06/2024");
      expect(result).toBe("1 BL");
    });

    it('should return "1 BL" for February in a leap year', () => {
      const result = createLamaSewa(29, "01/02/2024");
      expect(result).toBe("1 BL");
    });

    it('should return "1 BL" for February in a non-leap year', () => {
      const result = createLamaSewa(28, "01/02/2023");
      expect(result).toBe("1 BL");
    });

    it('should return "X HR" for partial month rental', () => {
      const result = createLamaSewa(15, "01/07/2024");
      expect(result).toBe("15 HR");
    });

    it("should throw an error for days exceeding month length", () => {
      expect(() => createLamaSewa(32, "01/07/2024")).toThrow(
        "Days borrowed is greater than days in month"
      );
    });
  });
});
