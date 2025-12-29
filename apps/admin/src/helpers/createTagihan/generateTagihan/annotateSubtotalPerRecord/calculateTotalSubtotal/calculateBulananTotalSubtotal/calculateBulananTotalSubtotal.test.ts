import { calculateBulananTotalSubtotal } from "./calculateBulananTotalSubtotal";

describe("calculateBulananTotalSubtotal", () => {
  test("should return correct total for valid inputs", () => {
    const record = { jumlah: 5, hargaBulanan: 1000 };
    const result = calculateBulananTotalSubtotal(record);
    expect(result).toBe(5000);
  });

  test("should throw an error if jumlah is not an integer", () => {
    const record = { jumlah: 5.5, hargaBulanan: 1000 };
    expect(() => calculateBulananTotalSubtotal(record)).toThrow(
      "Jumlah must be an integer"
    );
  });

  test("should return 0 if jumlah is 0", () => {
    const record = { jumlah: 0, hargaBulanan: 1000 };
    const result = calculateBulananTotalSubtotal(record);
    expect(result).toBe(0);
  });

  test("should allow negative jumlah", () => {
    const record = { jumlah: -5, hargaBulanan: 1000 };
    expect(() => calculateBulananTotalSubtotal(record)).toThrow();
  });

  test("should throw an error if hargaBulanan is negative", () => {
    const record = { jumlah: 5, hargaBulanan: -1000 };
    expect(() => calculateBulananTotalSubtotal(record)).toThrow();
  });

  test("should handle zero hargaBulanan correctly", () => {
    const record = { jumlah: 5, hargaBulanan: 0 };
    const result = calculateBulananTotalSubtotal(record);
    expect(result).toBe(0);
  });

  test("should handle decimal hargaBulanan correctly", () => {
    const record = { jumlah: 5, hargaBulanan: 1000.75 };
    const result = calculateBulananTotalSubtotal(record);
    expect(result).toBe(5003.75);
  });
});
