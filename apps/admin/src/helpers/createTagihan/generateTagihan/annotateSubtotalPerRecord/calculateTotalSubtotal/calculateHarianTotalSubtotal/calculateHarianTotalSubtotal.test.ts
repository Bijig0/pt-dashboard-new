import { calculateHarianTotalSubtotal } from "./calculateHarianTotalSubtotal";

describe("calculateHarianTotalSubtotal", () => {
  test("should return correct total for given days, jumlah, and hargaHarian", () => {
    const record = { days: 5, jumlah: 10, hargaHarian: 20 };
    const result = calculateHarianTotalSubtotal(record);
    expect(result).toBe(1000); // 5 * 10 * 20 = 1000
  });

  test("should return 0 if days is 0", () => {
    const record = { days: 0, jumlah: 10, hargaHarian: 20 };
    const result = calculateHarianTotalSubtotal(record);
    expect(result).toBe(0); // 0 * 10 * 20 = 0
  });

  test("should return 0 if jumlah is 0", () => {
    const record = { days: 5, jumlah: 0, hargaHarian: 20 };
    const result = calculateHarianTotalSubtotal(record);
    expect(result).toBe(0); // 5 * 0 * 20 = 0
  });

  test("should return 0 if hargaHarian is 0", () => {
    const record = { days: 5, jumlah: 10, hargaHarian: 0 };
    const result = calculateHarianTotalSubtotal(record);
    expect(result).toBe(0); // 5 * 10 * 0 = 0
  });

  test("should handle negative values correctly", () => {
    const record = { days: -5, jumlah: 10, hargaHarian: 20 };
    const result = calculateHarianTotalSubtotal(record);
    expect(result).toBe(-1000); // -5 * 10 * 20 = -1000
  });

  describe("should not allow decimal days or jumlah, these should be whole numbers", () => {
    test("days only as decimal", () => {
      const record = { days: 5.5, jumlah: 100, hargaHarian: 20 } as const;
      expect(() => calculateHarianTotalSubtotal(record)).toThrow();
    });

    test("jumlah only as decimal", () => {
      const record = { days: 5, jumlah: 100.5, hargaHarian: 20 } as const;
      expect(() => calculateHarianTotalSubtotal(record)).toThrow();
    });

    test("both as decimal", () => {
      const record = {
        days: 5.5,
        jumlah: 100.5,
        hargaHarian: 20,
      } as const;
      expect(() => calculateHarianTotalSubtotal(record)).toThrow();
    });
  });

  test("should handle decimal hargaHarian correctly if they sum to whole number", () => {
    const record = { days: 5, jumlah: 10, hargaHarian: 20.3 };
    const result = calculateHarianTotalSubtotal(record);
    expect(result).toEqual(1015); // 5 * 10 * 20.3 = 203
  });

  test("should round to two decimal placces correctly", () => {
    const record = { days: 23, jumlah: 10, hargaHarian: 0.48 };
    const result = calculateHarianTotalSubtotal(record);
    expect(result).toEqual(110.4); // 23 * 10 * 0.48 = 110.39999999999999
  });
});
